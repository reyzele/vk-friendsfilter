import { Auth } from './common/auth';
import { Dnd } from './common/dnd';
import { Filter } from './common/filter';

if (VK) {
  const params = Auth();
  const filterMap = Filter(params);

  Dnd(params, filterMap);
}