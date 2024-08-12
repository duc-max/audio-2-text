import Input from "../components/Input";
import ProductOV from "../components/ProductOV";

const publicRoutes = [
  { path: "/", component: ProductOV },
  { path: "/upload", component: Input },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
