import {HomeComponent} from '../../home/home.component';
import {ErrorPageComponent} from '../../error-page/error-page.component';
import {QueryBuilderComponent} from "../../query-builder/query-builder.component";

export const RouterConfig = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'query',
    component: QueryBuilderComponent
  },
  {
    path: '**',
    component: ErrorPageComponent
  },
];
