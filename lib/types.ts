export type mails = {
  id: string;
  created_at: string;
  user_id: string;
  email_type: string;
  subject: string;
  body: string;
  confirmation_ur: string;
  provider_response: string;
  template_id: string;
  recipient: string;
  sender_email?: string;
  sender_name?: string;
}

export type user_profile = {
  id: string;
  auth_user: string;
  email: string;
  username: string;
  fullName?: string;
  created_at: string;
  updated_at: string;
}
