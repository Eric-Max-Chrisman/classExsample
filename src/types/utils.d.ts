type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

type AuthRequest = {
  email: string;
  password: string;
};

// for changing user email
type UserIdEmailParam = {
  userId: string;
  newEmail: string;
}
