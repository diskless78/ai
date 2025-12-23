import type { IValue } from 'src/models/common/models.type';

/**
 * System state - Manages system-wide select options data
 */
export interface IReduxSystemState {
  groups: IValue[];
  loading: boolean;
}
