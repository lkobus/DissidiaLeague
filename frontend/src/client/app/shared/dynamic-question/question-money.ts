import { QuestionBase } from './question-base';

export class MoneyQuestion extends QuestionBase<string> {
  controlType = 'numeric';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
