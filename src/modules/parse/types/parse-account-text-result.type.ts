import { ParsePhotoLocation } from './parse-account-photo-result.type';
export class ParseAccountTextResult {
    isAllowed: boolean
    age: number
    location?: ParsePhotoLocation
}