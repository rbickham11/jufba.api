import snakeCase from 'lodash/snakeCase';
import mapKeys from 'lodash/fp/mapKeys';

export default mapKeys(snakeCase);