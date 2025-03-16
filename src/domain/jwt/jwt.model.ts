export type IProviders = "google" | "github" | "email";

export interface IUserMetadata {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  phone_verified: boolean;
  picture: string;
  provider_id: string;
  sub: string;
}

export interface IAppMetadata {
  provider: IProviders;
  providers: IProviders[];
}

export interface IAuthMethod {
  method: string;
  timestamp: number;
}

export interface IJwt {

  // Campos básicos do JWT
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  
  // Campos de usuário
  email: string;
  phone: string;
  
  // Metadados
  app_metadata: IAppMetadata;
  user_metadata: IUserMetadata;
  
  // Informações de autenticação
  role: string;
  aal: string;
  amr: IAuthMethod[];
  session_id: string;
  is_anonymous: boolean;
}

export interface  IIintertalJWT extends IJwt {
  id: string; //internal id -> db id
  loginProviderId: string; // id for platform login -> supabase id
}