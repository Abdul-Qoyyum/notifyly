import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  parseTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/#\{([^}]+)\}/g, (match, key) => {
      return data.hasOwnProperty(key) ? data[key] : match;
    });
  }
}
