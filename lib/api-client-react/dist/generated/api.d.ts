import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AuthUserEnvelope, BeginBrowserLoginParams, ErrorEnvelope, HandleBrowserLoginCallbackParams, HealthStatus, LogoutBrowserSessionParams, LogoutSuccess, MobileTokenExchangeRequest, MobileTokenExchangeSuccess, OwnerAccessResponse, PublishObjectInput, PublishObjectResponse, UploadUrlRequest, UploadUrlResponse } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCurrentAuthUserUrl: () => string;
/**
 * @summary Get the current authentication state
 */
export declare const getCurrentAuthUser: (options?: Parameters<typeof customFetch>[1]) => Promise<AuthUserEnvelope>;
export declare const getGetCurrentAuthUserQueryKey: () => readonly ["/api/auth/user"];
export declare const getGetCurrentAuthUserQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentAuthUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCurrentAuthUserQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentAuthUser>>>;
export type GetCurrentAuthUserQueryError = ErrorType<unknown>;
/**
 * @summary Get the current authentication state
 */
export declare function useGetCurrentAuthUser<TData = Awaited<ReturnType<typeof getCurrentAuthUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetWishListOwnerAccessUrl: () => string;
/**
 * @summary Check whether the current user owns the wish list
 */
export declare const getWishListOwnerAccess: (options?: Parameters<typeof customFetch>[1]) => Promise<OwnerAccessResponse>;
export declare const getGetWishListOwnerAccessQueryKey: () => readonly ["/api/auth/owner"];
export declare const getGetWishListOwnerAccessQueryOptions: <TData = Awaited<ReturnType<typeof getWishListOwnerAccess>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWishListOwnerAccess>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWishListOwnerAccess>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWishListOwnerAccessQueryResult = NonNullable<Awaited<ReturnType<typeof getWishListOwnerAccess>>>;
export type GetWishListOwnerAccessQueryError = ErrorType<unknown>;
/**
 * @summary Check whether the current user owns the wish list
 */
export declare function useGetWishListOwnerAccess<TData = Awaited<ReturnType<typeof getWishListOwnerAccess>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWishListOwnerAccess>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getClaimWishListOwnerAccessUrl: () => string;
/**
 * @summary Claim ownership if no owner has been registered
 */
export declare const claimWishListOwnerAccess: (options?: Parameters<typeof customFetch>[1]) => Promise<OwnerAccessResponse>;
export declare const getClaimWishListOwnerAccessMutationKey: () => readonly ["claimWishListOwnerAccess"];
export declare const getClaimWishListOwnerAccessMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof claimWishListOwnerAccess>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof claimWishListOwnerAccess>>, TError, void, TContext>;
export type ClaimWishListOwnerAccessMutationResult = NonNullable<Awaited<ReturnType<typeof claimWishListOwnerAccess>>>;
export type ClaimWishListOwnerAccessMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Claim ownership if no owner has been registered
*/
export declare const useClaimWishListOwnerAccess: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof claimWishListOwnerAccess>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof claimWishListOwnerAccess>>, TError, void, TContext>;
export declare const getBeginBrowserLoginUrl: (params?: BeginBrowserLoginParams) => string;
/**
 * @summary Start the browser login flow
 */
export declare const beginBrowserLogin: (params?: BeginBrowserLoginParams, options?: Parameters<typeof customFetch>[1]) => Promise<unknown>;
export declare const getBeginBrowserLoginQueryKey: (params?: BeginBrowserLoginParams) => readonly ["/api/login", ...BeginBrowserLoginParams[]];
export declare const getBeginBrowserLoginQueryOptions: <TData = Awaited<ReturnType<typeof beginBrowserLogin>>, TError = ErrorType<void>>(params?: BeginBrowserLoginParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof beginBrowserLogin>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof beginBrowserLogin>>, TError, TData> & {
    queryKey: QueryKey;
};
export type BeginBrowserLoginQueryResult = NonNullable<Awaited<ReturnType<typeof beginBrowserLogin>>>;
export type BeginBrowserLoginQueryError = ErrorType<void>;
/**
 * @summary Start the browser login flow
 */
export declare function useBeginBrowserLogin<TData = Awaited<ReturnType<typeof beginBrowserLogin>>, TError = ErrorType<void>>(params?: BeginBrowserLoginParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof beginBrowserLogin>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getHandleBrowserLoginCallbackUrl: (params?: HandleBrowserLoginCallbackParams) => string;
/**
 * @summary Complete the browser login flow
 */
export declare const handleBrowserLoginCallback: (params?: HandleBrowserLoginCallbackParams, options?: Parameters<typeof customFetch>[1]) => Promise<unknown>;
export declare const getHandleBrowserLoginCallbackQueryKey: (params?: HandleBrowserLoginCallbackParams) => readonly ["/api/callback", ...HandleBrowserLoginCallbackParams[]];
export declare const getHandleBrowserLoginCallbackQueryOptions: <TData = Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError = ErrorType<void>>(params?: HandleBrowserLoginCallbackParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HandleBrowserLoginCallbackQueryResult = NonNullable<Awaited<ReturnType<typeof handleBrowserLoginCallback>>>;
export type HandleBrowserLoginCallbackQueryError = ErrorType<void>;
/**
 * @summary Complete the browser login flow
 */
export declare function useHandleBrowserLoginCallback<TData = Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError = ErrorType<void>>(params?: HandleBrowserLoginCallbackParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof handleBrowserLoginCallback>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getLogoutBrowserSessionUrl: (params?: LogoutBrowserSessionParams) => string;
/**
 * @summary End the browser session
 */
export declare const logoutBrowserSession: (params?: LogoutBrowserSessionParams, options?: Parameters<typeof customFetch>[1]) => Promise<unknown>;
export declare const getLogoutBrowserSessionQueryKey: (params?: LogoutBrowserSessionParams) => readonly ["/api/logout", ...LogoutBrowserSessionParams[]];
export declare const getLogoutBrowserSessionQueryOptions: <TData = Awaited<ReturnType<typeof logoutBrowserSession>>, TError = ErrorType<void>>(params?: LogoutBrowserSessionParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof logoutBrowserSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof logoutBrowserSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type LogoutBrowserSessionQueryResult = NonNullable<Awaited<ReturnType<typeof logoutBrowserSession>>>;
export type LogoutBrowserSessionQueryError = ErrorType<void>;
/**
 * @summary End the browser session
 */
export declare function useLogoutBrowserSession<TData = Awaited<ReturnType<typeof logoutBrowserSession>>, TError = ErrorType<void>>(params?: LogoutBrowserSessionParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof logoutBrowserSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getExchangeMobileAuthorizationCodeUrl: () => string;
/**
 * @summary Exchange a mobile authorization code
 */
export declare const exchangeMobileAuthorizationCode: (mobileTokenExchangeRequest: MobileTokenExchangeRequest, options?: Parameters<typeof customFetch>[1]) => Promise<MobileTokenExchangeSuccess>;
export declare const getExchangeMobileAuthorizationCodeMutationKey: () => readonly ["exchangeMobileAuthorizationCode"];
export declare const getExchangeMobileAuthorizationCodeMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, ExchangeMobileAuthorizationCodeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, ExchangeMobileAuthorizationCodeMutationVariables, TContext>;
export type ExchangeMobileAuthorizationCodeMutationResult = NonNullable<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>>;
export type ExchangeMobileAuthorizationCodeMutationBody = BodyType<MobileTokenExchangeRequest>;
export type ExchangeMobileAuthorizationCodeMutationError = ErrorType<ErrorEnvelope>;
export type ExchangeMobileAuthorizationCodeMutationVariables = {
    data: BodyType<MobileTokenExchangeRequest>;
};
/**
* @summary Exchange a mobile authorization code
*/
export declare const useExchangeMobileAuthorizationCode: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, ExchangeMobileAuthorizationCodeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof exchangeMobileAuthorizationCode>>, TError, ExchangeMobileAuthorizationCodeMutationVariables, TContext>;
export declare const getLogoutMobileSessionUrl: () => string;
/**
 * @summary End a mobile session
 */
export declare const logoutMobileSession: (options?: Parameters<typeof customFetch>[1]) => Promise<LogoutSuccess>;
export declare const getLogoutMobileSessionMutationKey: () => readonly ["logoutMobileSession"];
export declare const getLogoutMobileSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
export type LogoutMobileSessionMutationResult = NonNullable<Awaited<ReturnType<typeof logoutMobileSession>>>;
export type LogoutMobileSessionMutationError = ErrorType<unknown>;
/**
* @summary End a mobile session
*/
export declare const useLogoutMobileSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logoutMobileSession>>, TError, void, TContext>;
export declare const getRequestUploadUrlUrl: () => string;
/**
 * @summary Request a presigned URL for a wish photo
 */
export declare const requestUploadUrl: (uploadUrlRequest: UploadUrlRequest, options?: Parameters<typeof customFetch>[1]) => Promise<UploadUrlResponse>;
export declare const getRequestUploadUrlMutationKey: () => readonly ["requestUploadUrl"];
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<ErrorEnvelope>;
export type RequestUploadUrlMutationVariables = {
    data: BodyType<UploadUrlRequest>;
};
/**
* @summary Request a presigned URL for a wish photo
*/
export declare const useRequestUploadUrl: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, RequestUploadUrlMutationVariables, TContext>;
export declare const getPublishWishPhotoUrl: () => string;
/**
 * @summary Make an uploaded wish photo visible on the shared list
 */
export declare const publishWishPhoto: (publishObjectInput: PublishObjectInput, options?: Parameters<typeof customFetch>[1]) => Promise<PublishObjectResponse>;
export declare const getPublishWishPhotoMutationKey: () => readonly ["publishWishPhoto"];
export declare const getPublishWishPhotoMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof publishWishPhoto>>, TError, PublishWishPhotoMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof publishWishPhoto>>, TError, PublishWishPhotoMutationVariables, TContext>;
export type PublishWishPhotoMutationResult = NonNullable<Awaited<ReturnType<typeof publishWishPhoto>>>;
export type PublishWishPhotoMutationBody = BodyType<PublishObjectInput>;
export type PublishWishPhotoMutationError = ErrorType<ErrorEnvelope>;
export type PublishWishPhotoMutationVariables = {
    data: BodyType<PublishObjectInput>;
};
/**
* @summary Make an uploaded wish photo visible on the shared list
*/
export declare const usePublishWishPhoto: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof publishWishPhoto>>, TError, PublishWishPhotoMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof publishWishPhoto>>, TError, PublishWishPhotoMutationVariables, TContext>;
export declare const getGetPublicObjectUrl: (filePath: string) => string;
/**
 * @summary Serve a public asset
 */
export declare const getPublicObject: (filePath: string, options?: Parameters<typeof customFetch>[1]) => Promise<Blob>;
export declare const getGetPublicObjectQueryKey: (filePath: string) => readonly [`/api/storage/public-objects/${string}`];
export declare const getGetPublicObjectQueryOptions: <TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPublicObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getPublicObject>>>;
export type GetPublicObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve a public asset
 */
export declare function useGetPublicObject<TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStorageObjectUrl: (objectPath: string) => string;
/**
 * @summary Serve an uploaded wish photo
 */
export declare const getStorageObject: (objectPath: string, options?: Parameters<typeof customFetch>[1]) => Promise<Blob>;
export declare const getGetStorageObjectQueryKey: (objectPath: string) => readonly [`/api/storage/objects/${string}`];
export declare const getGetStorageObjectQueryOptions: <TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStorageObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getStorageObject>>>;
export type GetStorageObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve an uploaded wish photo
 */
export declare function useGetStorageObject<TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map