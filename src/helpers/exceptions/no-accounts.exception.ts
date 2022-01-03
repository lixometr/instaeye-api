export class NoAccountsException extends Error {
  private noAccounts: boolean = true;
  constructor() {
    super('No accounts left');
  }
}
