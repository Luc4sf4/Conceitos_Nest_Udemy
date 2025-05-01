import { RegexInterface } from './regex.protocol';

export class OnlyLowercasesLettersRegex implements RegexInterface {
  execute(str: string): string {
    return str.replace(/[^a-z]/g, '');
  }
}
