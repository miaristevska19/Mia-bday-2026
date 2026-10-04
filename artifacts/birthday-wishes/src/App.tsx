import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, ImagePlus, LogOut, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { useAuth } from '@workspace/replit-auth-web';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

// "image" is a file name inside the public/images folder, for example 'images/perfume.jpg'
type Gift = { id: string; name: string; price: number; url?: string; note?: string; photoPath?: string; image?: string };
type Step = 'intro' | 'budget' | 'gifts' | 'done';
type OwnerAccess = { claimed: boolean; isOwner: boolean };
const STORAGE_KEY = 'birthday-wishes-v1';
const BUDGET_LIMITS_STORAGE_KEY = 'birthday-wishes-budget-limits-v1';
const budgetTierLabels = [
  'Од мене толку од госпо поќе',
  'не барам многу',
  'не барам многу премиум+',
] as const;
type BudgetTier = { id: string; label: string; max: number };
const defaultBudgetLimits = [47, 150, 160];
function makeBudgetTiers(limits: number[] = defaultBudgetLimits): BudgetTier[] {
  return budgetTierLabels.map((label, index) => ({
    id: `category-${index + 1}`,
    label,
    max: limits[index] ?? defaultBudgetLimits[index],
  }));
}

// The four category buttons on the second screen.
// A gift is shown when its price is above "above" and up to (and including) "upTo".
type BudgetOption = { id: string; label: string; description: string; title: string; subtitle: string; above: number; upTo: number };
const budgetOptions: BudgetOption[] = [
  { id: 'category-1', label: 'Од мене толку од госпо поќе', description: 'До 59€', title: 'Категорија: Од мене толку, од госпо поќе', subtitle: 'Мали ситници ама голема среќа ❤️', above: -1, upTo: 59 },
  { id: 'category-2', label: 'Не барам многу', description: 'Од 59 до 150€', title: 'Категорија: Не барам многу', subtitle: 'Поголеми ситници иста среќа ✨', above: 59, upTo: 150 },
  { id: 'category-3', label: 'Не барам многу Премиум+', description: 'Над 150€', title: 'Категорија: Не барам многу Премиум+', subtitle: 'Нешто поскапичко 💸', above: 150, upTo: Infinity },
  { id: 'any', label: 'Не барам многу Инфинити ∞', description: 'Сите подароци', title: 'Категорија: Не барам многу Инфинити ∞', subtitle: 'Се шо ви душа сака 🎁', above: -1, upTo: Infinity },
];

// The list of gifts. To add an image, upload it to public/images and add image: 'images/file-name.jpg'
const starterGifts: Gift[] = [
  {
    id: 'purse',
    name: 'Чанта - Dolls kill',
    price: 47,
    url: 'https://www.dollskill.com/products/savage-ways-shoulder-bag',
    image: 'images/purse.jpg',
  },
  {
    id: 'fountain-pen',
    name: 'Стило - Fountain pen',
    price: 99,
    note: 'Nib: Medium (M)',
    url: 'https://appelboom.com/conklin-all-american-yellowstone-fountain-pen/',
    image: 'images/fountain-pen.jpg',
  },
  {
    id: 'sunglasses',
    name: 'RayBan наочари',
    price: 169,
    note: 'Модел: RB3774D\nКафеави стакла*\n*Треба да ги пробам и ги немаше во една продавница за да се осигурам за моделот',
    url: 'https://www.ray-ban.com/france/lunettes-de-soleil/RB3774Drb3774d-dor%C3%A9%20arista/8056262667033',
    image: 'images/sunglasses.jpg',
  },
  {
    id: 'peace',
    name: 'World peace',
    price: 999999999999999,
    note: 'Само ако сте во можност',
    url: 'https://www.youtube.com/watch?v=Aq5WXmQQooo',
    image: 'images/peace.jpg',
  },
  {
    id: 'burek',
    name: 'Бурек од Фреш',
    price: 0.7,
    note: 'Од ова поубо нема',
    url: 'https://maps.app.goo.gl/6XE2Ms6Rzi2mvwUi7',
    image: 'images/burek.jpg',
  },
];
const noButtonOffsets = [
  { x: 72, y: -18 },
  { x: -34, y: 27 },
  { x: 48, y: 24 },
  { x: -68, y: -20 },
  { x: 26, y: -30 },
];
const money = (amount: number) => `€${amount}`;

function validateGifts(input: unknown): Gift[] | null {
  if (!Array.isArray(input) || input.length > 100) return null;
  const gifts: Gift[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const gift = item as Record<string, unknown>;
    if (typeof gift.name !== 'string' || !gift.name.trim() || gift.name.length > 80) return null;
    if (typeof gift.price !== 'number' || !Number.isFinite(gift.price) || gift.price < 0 || gift.price > 100000) return null;
    if (gift.url !== undefined && typeof gift.url !== 'string') return null;
    if (gift.note !== undefined && typeof gift.note !== 'string') return null;
    if (gift.photoPath !== undefined && (typeof gift.photoPath !== 'string' || !/^\/objects\/uploads\/[a-f0-9]{64}\/[a-f0-9-]{36}$/.test(gift.photoPath))) return null;
    if (gift.image !== undefined && (typeof gift.image !== 'string' || !/^images\/[\w.\-]{1,100}$/.test(gift.image))) return null;
    let safeUrl: string | undefined;
    if (typeof gift.url === 'string' && gift.url.trim()) {
      try {
        const parsed = new URL(gift.url);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
        safeUrl = parsed.toString();
      } catch {
        return null;
      }
    }
    gifts.push({
      id: typeof gift.id === 'string' && gift.id.length < 100 ? gift.id : `${Date.now()}-${gifts.length}`,
      name: gift.name.trim(),
      price: Math.round(gift.price * 100) / 100,
      ...(safeUrl ? { url: safeUrl } : {}),
      ...(typeof gift.note === 'string' && gift.note.trim() ? { note: gift.note.trim().slice(0, 240) } : {}),
      ...(typeof gift.photoPath === 'string' ? { photoPath: gift.photoPath } : {}),
      ...(typeof gift.image === 'string' ? { image: gift.image } : {}),
    });
  }
  return gifts;
}

function validateBudgetLimits(input: unknown): number[] | null {
  if (!Array.isArray(input) || input.length !== budgetTierLabels.length) return null;
  if (!input.every((value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100000)) return null;
  return input.map((value) => Math.round(value * 100) / 100);
}

function decodeShare(): { gifts: Gift[] | null; budgetLimits: number[] | null; invalid: boolean } {
  const fragment = window.location.hash.slice(1);
  if (!fragment) return { gifts: null, budgetLimits: null, invalid: false };
  const encoded = fragment.startsWith('w=') ? fragment.slice(2) : fragment;
  try {
    const decoded = decodeURIComponent(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    const json = decodeURIComponent(Array.from(atob(decoded), (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''));
    const parsed = JSON.parse(json);
    const gifts = validateGifts(parsed?.gifts ?? parsed);
    const budgetLimits = validateBudgetLimits(parsed?.budgetLimits);
    return gifts ? { gifts, budgetLimits, invalid: false } : { gifts: null, budgetLimits: null, invalid: true };
  } catch {
    return { gifts: null, budgetLimits: null, invalid: true };
  }
}

function makeShareUrl(gifts: Gift[], budgetTiers: BudgetTier[]) {
  const json = JSON.stringify({ v: 2, gifts, budgetLimits: budgetTiers.map((tier) => tier.max) });
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return `${window.location.origin}${window.location.pathname}#w=${encoded}`;
}

const initialShare = typeof window !== 'undefined' ? decodeShare() : { gifts: null, budgetLimits: null, invalid: false };
const initialStored = typeof window !== 'undefined' ? (() => {
  try { return validateGifts(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')); } catch { return null; }
})() : null;
const initialStoredBudgetLimits = typeof window !== 'undefined' ? (() => {
  try { return validateBudgetLimits(JSON.parse(localStorage.getItem(BUDGET_LIMITS_STORAGE_KEY) || 'null')); } catch { return null; }
})() : null;
const queryClient = new QueryClient();

function Home() {
  const { isLoading: authLoading, isAuthenticated, login, logout } = useAuth();
  const [gifts, setGifts] = useState<Gift[]>(initialShare.gifts ?? initialStored ?? starterGifts);
  const [budgetTiers, setBudgetTiers] = useState<BudgetTier[]>(makeBudgetTiers(initialShare.budgetLimits ?? initialStoredBudgetLimits ?? defaultBudgetLimits));
  const [step, setStep] = useState<Step>('intro');
  const [noButtonOffset, setNoButtonOffset] = useState(-1);
  const [budget, setBudget] = useState<BudgetOption | null>(null);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const [shareError, setShareError] = useState(initialShare.invalid);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formPhotoPath, setFormPhotoPath] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [ownerAccess, setOwnerAccess] = useState<OwnerAccess | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (initialShare.gifts) localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShare.gifts));
    if (initialShare.budgetLimits) localStorage.setItem(BUDGET_LIMITS_STORAGE_KEY, JSON.stringify(initialShare.budgetLimits));
  }, []);
  useEffect(() => {
    localStorage.setItem(BUDGET_LIMITS_STORAGE_KEY, JSON.stringify(budgetTiers.map((tier) => tier.max)));
  }, [budgetTiers]);
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setOwnerLoading(true);
    fetch('/api/auth/owner', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Не можевме да го провериме пристапот.');
        return response.json() as Promise<OwnerAccess>;
      })
      .then((access) => { if (!cancelled) setOwnerAccess(access); })
      .catch(() => { if (!cancelled) setOwnerAccess(null); })
      .finally(() => { if (!cancelled) setOwnerLoading(false); });
    return () => { cancelled = true; };
  }, [authLoading, isAuthenticated]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const shownGifts = useMemo(
    () => budget === null ? gifts : gifts.filter((gift) => gift.price > budget.above && gift.price <= budget.upTo),
    [gifts, budget],
  );

  const activeOption = budget ?? budgetOptions[budgetOptions.length - 1];

  const commitGifts = (next: Gift[]) => {
    setGifts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setNotice('Листата е зачувана на овој уред.');
  };
  const updateBudgetLimit = (id: string, value: string) => {
    const max = Number(value);
    if (!Number.isFinite(max) || max < 0 || max > 100000) return;
    setBudgetTiers((current) => current.map((tier) => tier.id === id ? { ...tier, max: Math.round(max * 100) / 100 } : tier));
  };
  const startEdit = (gift?: Gift) => {
    setEditId(gift?.id ?? null);
    setFormName(gift?.name ?? '');
    setFormPrice(gift ? String(gift.price) : '');
    setFormUrl(gift?.url ?? '');
    setFormNote(gift?.note ?? '');
    setFormPhotoPath(gift?.photoPath ?? '');
    setPhotoError('');
    setFormError('');
  };
  const saveGift = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(formPrice);
    if (!formName.trim()) { setFormError('Внеси име за желбата.'); return; }
    if (!formPrice.trim() || !Number.isFinite(price) || price < 0) { setFormError('Внеси валидна цена од €0 или повеќе.'); return; }
    if (formUrl.trim()) {
      try {
        const parsed = new URL(formUrl);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error();
      } catch { setFormError('Внеси целосен линк што почнува со http:// или https://.'); return; }
    }
    const gift: Gift = {
      id: editId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: formName.trim(),
      price: Math.round(price * 100) / 100,
      ...(formUrl.trim() ? { url: formUrl.trim() } : {}),
      ...(formNote.trim() ? { note: formNote.trim() } : {}),
      ...(formPhotoPath ? { photoPath: formPhotoPath } : {}),
    };
    commitGifts(editId ? gifts.map((item) => item.id === editId ? gift : item) : [...gifts, gift]);
    startEdit();
  };
  const uploadWishPhoto = async (file: File) => {
    setPhotoError('');
    if (!ownerAccess?.isOwner) { setPhotoError('Најави се како сопственик за да прикачиш слика.'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setPhotoError('Избери JPEG, PNG или WebP слика.'); return; }
    if (file.size > 8 * 1024 * 1024) { setPhotoError('Сликата мора да биде помала од 8 MB.'); return; }
    setPhotoUploading(true);
    try {
      const request = await fetch('/api/storage/uploads/request-url', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      const upload = await request.json().catch(() => null);
      if (!request.ok || !upload?.uploadURL || !upload?.objectPath) throw new Error(upload?.error || 'Не можевме да ја подготвиме сликата за прикачување.');
      const uploaded = await fetch(upload.uploadURL, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
      if (!uploaded.ok) throw new Error('Сликата не успеа да се прикачи.');
      const publish = await fetch('/api/storage/objects/publish', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectPath: upload.objectPath }),
      });
      const published = await publish.json().catch(() => null);
      if (!publish.ok || typeof published?.objectPath !== 'string') throw new Error(published?.error || 'Не можевме да ја споделиме сликата.');
      setFormPhotoPath(published.objectPath);
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Сликата не успеа да се прикачи.');
    } finally {
      setPhotoUploading(false);
    }
  };
  const handleOwnerAction = async () => {
    if (editing) { setEditing(false); return; }
    setStep('gifts');
    setBudget(null);
    if (!isAuthenticated) { login(); return; }
    if (ownerAccess?.isOwner) { setEditing(true); return; }
    if (ownerAccess?.claimed) { setNotice('Само сопственикот може да ја уредува листата.'); return; }
    try {
      const response = await fetch('/api/auth/owner/claim', { method: 'POST', credentials: 'include' });
      const access = await response.json().catch(() => null);
      if (!response.ok || !access || typeof access.isOwner !== 'boolean') {
        if (response.status === 409) setOwnerAccess({ claimed: true, isOwner: false });
        throw new Error(access?.error || 'Не можевме да ја преземеме сопственоста.');
      }
      setOwnerAccess(access as OwnerAccess);
      if (access.isOwner) {
        setEditing(true);
        setNotice('Ти си сопственик на листата. Само оваа сметка може да ја уредува.');
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Не можевме да ја преземеме сопственоста.');
    }
  };
  const copyShareLink = async () => {
    const url = makeShareUrl(gifts, budgetTiers);
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Линкот е копиран. Испрати ѝ го на сестра ти.');
    } catch {
      window.prompt('Копирај го линкот до роденденската листа:', url);
      setNotice('Линкот е подготвен за копирање.');
    }
  };

  const stepToGifts = (value: BudgetOption | null) => {
    setBudget(value);
    setStep('gifts');
  };
  const dodgeNoButton = () => {
    setNoButtonOffset((current) => (current + 1) % noButtonOffsets.length);
  };
  const goBack = () => {
    if (step === 'gifts') setStep('budget');
    else if (step === 'budget') setStep('intro');
  };

  return (
    <main className="app-shell">
      <div className="app-content">
        <header className="topbar">
          <a href="/" className="brand" aria-label="Скромна роденденска листа" onClick={(event) => { event.preventDefault(); setStep('intro'); setBudget(null); setEditing(false); }}>
            <span className="brand-mark">с</span><span className="brand-name">Скромна роденденска листа</span>
          </a>
        </header>
        {shareError && <div className="warning-banner" role="alert" data-testid="status-invalid-share">Овој линк не можевме да го отвориме. Ја прикажуваме зачуваната листа, која сè уште можеш да ја уредуваш.</div>}

        {step === 'intro' && !editing && (
          <section className="hero" aria-labelledby="hero-title">
            <div>
              <span className="eyebrow">Големото прашање овај Октомври 2026та</span>
              <h1 id="hero-title">Шо поклон<br /><em>да му купиме</em><br />на Миа?</h1>
              <p className="hero-copy">Дали сте возбудени да видите шо сака Миа за роденден?</p>
              <div className="hero-choices">
                <button className="primary-button" onClick={() => setStep('budget')} data-testid="button-start">
                  Да <span aria-hidden="true">→</span>
                </button>
                <button
                  className="no-button"
                  type="button"
                  aria-disabled="true"
                  onPointerEnter={dodgeNoButton}
                  onFocus={dodgeNoButton}
                  onClick={(event) => { event.preventDefault(); dodgeNoButton(); }}
                  style={noButtonOffset >= 0 ? {
                    transform: `translate(${noButtonOffsets[noButtonOffset].x}px, ${noButtonOffsets[noButtonOffset].y}px)`,
                  } : undefined}
                  data-testid="button-no"
                >
                  Не
                </button>
              </div>
            </div>
            <div className="illustration" aria-hidden="true">
              <div className="sun-disc" />
              <span className="spark one">+</span><span className="spark two">×</span><span className="spark three">+</span>
              <div className="gift-box"><div className="bow" /><div className="gift-tag">for me</div></div>
              <div className="ribbon-note">со љубов од моите омилени</div>
            </div>
          </section>
        )}

        {step === 'budget' && !editing && (
          <section className="step-panel" aria-labelledby="budget-title">
            <div className="step-top"><span className="step-count">01 / 02 · роденденски желби</span><span className="step-track"><i /></span></div>
            <span className="eyebrow">Прво, избери буџет</span>
            <h2 id="budget-title">Избери категорија</h2>
            <p className="step-subtitle">избери категорија за да ги видиш поклоните според твоите можности</p>
            <div className="budget-options">
              {budgetOptions.map((option) => (
                <button key={option.id} className="budget-option" onClick={() => stepToGifts(option)} data-testid={`button-budget-${option.id}`}>
                  <strong>{option.label}</strong><span>{option.description}</span>
                </button>
              ))}
            </div>
            <div className="step-actions">
              <button className="text-button" onClick={goBack} data-testid="button-back-intro"><ArrowLeft size={15} /> Назад</button>
              <span className="step-count">За Миа</span>
            </div>
          </section>
        )}

        {step === 'gifts' && (
          <section className="step-panel" aria-labelledby="gift-title">
            <div className="step-top"><span className="step-count">02 / 02 · идеи за подарок</span><span className="step-track is-full"><i /></span></div>
            <div className="gift-heading">
              <div>
                <span className="eyebrow">{budget === null ? 'Сите желби' : budget.description}</span>
                <h2 id="gift-title">{editing ? 'Твоите роденденски желби' : activeOption.title}</h2>
                <p className="step-subtitle">{editing ? 'Додај детали, смени цена или отстрани желба.' : activeOption.subtitle}</p>
              </div>
              <span className="gift-count">{shownGifts.length} {shownGifts.length === 1 ? 'желба' : 'желби'}</span>
            </div>

            {editing ? (
              <div className="edit-layout">
                <section className="budget-tier-editor" aria-labelledby="budget-tier-title">
                  <h3 id="budget-tier-title">Горна цена по категорија</h3>
                  <p>Смени ги износите кога ќе ги ажурираш подароците.</p>
                  <div className="budget-tier-fields">
                    {budgetTiers.map((tier) => (
                      <label className="field" key={tier.id} htmlFor={`limit-${tier.id}`}>
                        <span>{tier.label}</span>
                        <div className="limit-input"><span>€</span><input id={`limit-${tier.id}`} type="number" min="0" step="1" value={tier.max} onChange={(event) => updateBudgetLimit(tier.id, event.target.value)} aria-label={`Максимум за ${tier.label}`} /></div>
                      </label>
                    ))}
                  </div>
                </section>
                <div className="edit-list">
                  {gifts.length === 0 ? <div className="empty-state"><strong>Почнуваме одново.</strong><p>Додај ја првата роденденска желба со формуларот.</p></div> : gifts.map((gift) => (
                    <article className="edit-item" key={gift.id} data-testid={`edit-wish-${gift.id}`}>
                      <div><strong>{gift.name}</strong><span>{money(gift.price)}{gift.note ? ` · ${gift.note}` : ''}</span></div>
                      <div className="item-controls">
                        <button className="icon-button" aria-label={`Уреди: ${gift.name}`} onClick={() => startEdit(gift)} data-testid={`button-edit-${gift.id}`}><Pencil size={14} /></button>
                        <button className="icon-button delete" aria-label={`Избриши: ${gift.name}`} onClick={() => { if (window.confirm(`Да се отстрани „${gift.name}“ од листата?`)) commitGifts(gifts.filter((item) => item.id !== gift.id)); }} data-testid={`button-delete-${gift.id}`}><Trash2 size={14} /></button>
                      </div>
                    </article>
                  ))}
                  <button className="text-button" onClick={() => startEdit()} data-testid="button-add-wish"><Plus size={15} /> Додај уште една желба</button>
                </div>
                <form className="wish-form" onSubmit={saveGift}>
                  <h3>{editId ? 'Уреди желба' : 'Додај желба'}</h3>
                  <div className="field"><label htmlFor="wish-name">Која е желбата?</label><input id="wish-name" value={formName} onChange={(event) => setFormName(event.target.value)} placeholder="Име на подарокот" data-testid="input-wish-name" /></div>
                  <div className="field"><label htmlFor="wish-price">Цена во евра</label><input id="wish-price" type="number" min="0" step="0.01" value={formPrice} onChange={(event) => setFormPrice(event.target.value)} placeholder="0" data-testid="input-wish-price" /></div>
                  <div className="field"><label htmlFor="wish-url">Линк до подарокот <span>(незадолжително)</span></label><input id="wish-url" type="url" value={formUrl} onChange={(event) => setFormUrl(event.target.value)} placeholder="https://" data-testid="input-wish-url" /></div>
                  <div className="field"><label htmlFor="wish-note">Белешка <span>(незадолжително)</span></label><textarea id="wish-note" value={formNote} onChange={(event) => setFormNote(event.target.value)} placeholder="Боја, големина или зошто ти се допаѓа" data-testid="input-wish-note" /></div>
                  <div className="field">
                    <label htmlFor="wish-photo">Фотографија <span>(незадолжително)</span></label>
                    <input id="wish-photo" type="file" accept="image/jpeg,image/png,image/webp" disabled={photoUploading} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void uploadWishPhoto(file); event.currentTarget.value = ''; }} data-testid="input-wish-photo" />
                    <small className="field-hint">JPEG, PNG или WebP, до 8 MB. Сликата ќе ја гледа секој со линкот.</small>
                  </div>
                  {photoUploading && <p className="upload-status" role="status">Сликата се прикачува…</p>}
                  {photoError && <p className="form-error" role="alert">{photoError}</p>}
                  {formPhotoPath && <div className="photo-preview"><img src={`/api/storage${formPhotoPath}`} alt={formName ? `Фотографија за ${formName}` : 'Фотографија за желбата'} /><button className="text-button" type="button" onClick={() => setFormPhotoPath('')}>Отстрани фотографија</button></div>}
                  {formError && <p className="form-error" role="alert">{formError}</p>}
                  <button className="primary-button form-submit" type="submit" disabled={photoUploading} data-testid="button-save-wish">{editId ? <Check size={15} /> : <Plus size={15} />}{editId ? 'Зачувај промени' : 'Додај во листата'}</button>
                  {editId && <button className="text-button" type="button" onClick={() => startEdit()} data-testid="button-cancel-edit"><X size={14} /> Откажи</button>}
                </form>
              </div>
            ) : shownGifts.length === 0 ? (
              <div className="empty-state" data-testid="empty-filtered-results">
                <strong>Нема желби во овој буџет.</strong>
                <p>Пробај со друг буџет или прикажи ја целата листа.</p>
                <button className="text-button" onClick={() => setStep('budget')} data-testid="button-change-budget-empty">Избери друг буџет <ArrowRight size={14} /></button>
              </div>
            ) : (
              <div className="gift-list">
                {shownGifts.map((gift, index) => (
                  <article className="gift-row" key={gift.id} style={{ animationDelay: `${index * 80}ms` }} data-testid={`card-wish-${gift.id}`}>
                    {gift.image
                      ? <img className="gift-symbol gift-photo" src={`${import.meta.env.BASE_URL}${gift.image}`} alt={`Фотографија за ${gift.name}`} loading="lazy" />
                      : gift.photoPath
                        ? <img className="gift-symbol gift-photo" src={`/api/storage${gift.photoPath}`} alt={`Фотографија за ${gift.name}`} loading="lazy" />
                        : <div className="gift-symbol" aria-hidden="true">{gift.name.trim().charAt(0).toUpperCase()}</div>}
                    <div className="gift-info"><strong>{gift.name}</strong>{gift.note && <p style={{ whiteSpace: 'pre-line' }}>{gift.note}</p>}{gift.url && <a className="gift-link" href={gift.url} target="_blank" rel="noreferrer">Погледни го подарокот <ExternalLink size={11} /></a>}</div>
                    <span className="gift-price">{money(gift.price)}</span>
                  </article>
                ))}
              </div>
            )}

            {!editing && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '28px 0 8px' }}>
                <button className="primary-button" onClick={() => setStep('done')} data-testid="button-chose-gift">Го избрав поклонот !</button>
              </div>
            )}

            <div className="step-actions">
              <button className="text-button" onClick={() => editing ? setEditing(false) : goBack()} data-testid="button-change-budget"><ArrowLeft size={15} /> {editing ? 'Назад кон желбите' : 'Промени буџет'}</button>
              <div style={{ display: 'flex', gap: 9 }}>
                {editing ? (
                  <button className="share-button" onClick={copyShareLink} data-testid="button-copy-share"><Copy size={14} /> Копирај линк</button>
                ) : (
                  <>
                    {ownerAccess?.isOwner && <button className="edit-button" onClick={() => setEditing(true)} data-testid="button-edit-list"><Pencil size={14} /> Уреди листа</button>}
                    <button className="share-button" onClick={copyShareLink} data-testid="button-copy-share"><Copy size={14} /> Сподели листа</button>
                  </>
                )}
              </div>
            </div>
            {notice && <div className="feedback" role="status" data-testid="status-feedback"><Check size={14} /> {notice}</div>}
            {editing && <p className="share-note"><RotateCcw size={12} /> Промените се зачувуваат на овој уред. Копирај нов линк за да ја споделиш ажурираната листа.</p>}
          </section>
        )}
        {step === 'done' && (
          <section className="step-panel" aria-labelledby="done-title" style={{ textAlign: 'center' }} data-testid="screen-done">
            <h2 id="done-title">Се одлучи? Супер !!</h2>
            <p className="step-subtitle" style={{ maxWidth: 560, margin: '16px auto 0', fontSize: '1.15rem', lineHeight: 1.6 }}>Да знајш шо да избра од листата, од најскапо до најефтино, или пак нешто шо сосема не беше тука, од се срце ФАЛА ! Вие сте ми тие најбитните а се останато е само за малце fun ✨🤗❤️</p>
            <img
              src={`${import.meta.env.BASE_URL}images/thanks.jpg`}
              alt=""
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
              style={{ display: 'block', width: '100%', maxWidth: 360, margin: '28px auto 0', borderRadius: 20, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 32 }}>
              <button
                className="primary-button"
                onClick={() => { setBudget(null); setStep('budget'); }}
                style={{ width: '100%', maxWidth: 320, padding: '18px 28px', fontSize: '1.15rem', fontWeight: 700, borderRadius: 18, justifyContent: 'center', boxShadow: '0 8px 22px rgba(0, 0, 0, 0.18)' }}
                data-testid="button-keep-shopping"
              >
                Actually not done shopping
              </button>
              <button
                onClick={() => { setBudget(null); setStep('intro'); }}
                style={{ width: '100%', maxWidth: 210, padding: '11px 20px', fontSize: '0.95rem', fontWeight: 600, borderRadius: 14, border: '1.5px solid currentColor', background: 'transparent', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit' }}
                data-testid="button-home"
              >
                Почетна страна
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
