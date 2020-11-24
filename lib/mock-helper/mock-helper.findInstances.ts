import { Type } from '../common/core.types';
import { getSourceOfMock } from '../common/func.get-source-of-mock';
import { MockedDebugElement, MockedDebugNode } from '../mock-render/types';

import funcGetLastFixture from './func.get-last-fixture';

function nestedCheck<T>(
  result: T[],
  node: MockedDebugNode & { childNodes?: MockedDebugNode[] },
  callback: (node: MockedDebugNode) => undefined | T,
) {
  const element = callback(node);
  if (element) {
    result.push(element);
  }
  const childNodes = node?.childNodes || [];
  for (const childNode of childNodes) {
    nestedCheck(result, childNode, callback);
  }
}

export default <T>(...args: any[]): T[] => {
  const el: undefined | MockedDebugElement =
    typeof args[0] !== 'object' ? undefined : args[0].debugElement ? args[0].debugElement : args[0];
  const sel: Type<any> = el ? args[1] : args[0];

  const debugElement = el || funcGetLastFixture()?.debugElement;

  const result: T[] = [];
  nestedCheck<T>(result, debugElement, node => {
    try {
      return node.injector.get(getSourceOfMock(sel));
    } catch (error) {
      return undefined;
    }
  });

  return result;
};
