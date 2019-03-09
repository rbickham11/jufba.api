import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';

export default function camelCaseKeys(object={}) {
  return mapKeys(object, (_, key) => camelCase(key));
};