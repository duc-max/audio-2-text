import Input from "../components/Main";
import ProductOV from "../components/ProductOV";
const publicRoutes = [
  { path: "/", component: Input },
  { path: "/intro", component: ProductOV },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
