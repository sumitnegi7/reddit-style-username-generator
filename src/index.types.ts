type Style = 'lowerCase' | 'upperCase' | 'capital';

export interface Config {
  dictionaries: string[][];
  separator?: string;
  length?: number;
  style?: Style;
}
