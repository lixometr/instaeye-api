export class NoProxyException extends Error {
  private noProxy: boolean = true;
  constructor() {
    super('No proxy left');
    
  }
}
