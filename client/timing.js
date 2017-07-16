import { ReactiveVar } from 'meteor/reactive-var';

export const contentSelector = new ReactiveVar('otherblaze');
export const state = {
  clickTime: new Date().valueOf(),
  previous: null,
  timingFunction: null
};

export function logTime() {
  const difference = new Date().valueOf() - state.clickTime;
  console.log(`Time ${state.previous} -> ${contentSelector.get()}: ${difference}`);
  if (state.timingFunction) state.timingFunction(difference);
}
