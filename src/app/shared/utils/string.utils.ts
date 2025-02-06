export class StringUtils {
  static removeSpecialCharacterUrl(value: string): string {
    value = value.replace(/\(/g, '%28').replace(/\)/g, '%29');
    value = value
      .replace(/\,/g, '%31')
      .replace(/\</g, '%32')
      .replace(/\>/g, '%33')
      .replace(/\-/g, '%34')
      .replace(/\&/g, '%35');
    return value.replace(/\//g, '');
  }

  static addSpecialCharacter(value: string): string {
    return value
      .replace(/\%28/g, '(')
      .replace(/\%29/g, ')')
      .replace(/\%31/g, ',')
      .replace(/\%32/g, '<')
      .replace(/\%33/g, '>')
      .replace(/\%34/g, '-')
      .replace(/\%35/g, '&');
  }
}
