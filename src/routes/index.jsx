import Input from "../components/Main";
import ProductOV from "../components/ProductOV";
const publicRoutes = [
  { path: "/", component: ProductOV },
  { path: "/converter", component: Input },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
