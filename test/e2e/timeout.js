import { defineSupportCode } from 'cucumber';

defineSupportCode(({ setDefaultTimeout }) => {
  setDefaultTimeout(30 * 1000);
});
