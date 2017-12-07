import {HomeComponent} from '../../home/home.component';
import {ErrorPageComponent} from '../../error-page/error-page.component';
import {QueryBuilderComponent} from "../../query-builder/query-builder.component";
import {QueryPageComponent} from "../../query-page/query-page.component";

export const RouterConfig = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'query',
    component: QueryPageComponent
  },
  {
    path: '**',
    component: ErrorPageComponent
  },
];
