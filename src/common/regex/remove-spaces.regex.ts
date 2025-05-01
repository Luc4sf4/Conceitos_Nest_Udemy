import { RegexInterface } from './regex.protocol';

export class RemoveSpacesRegex implements RegexInterface {
  execute(str: string): string {
    return str.replace(/\s+/g, '');
  }
}
