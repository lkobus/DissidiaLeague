import { QuestionBase } from './question-base';

export class SingleSelectQuestion extends QuestionBase<string> {
  controlType = 'single-select';
  type: string;
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.type = options['type'] || '';
  }
}
