import Converter from "../components/Converter";
import Input from "../components/Input";
import ProductOV from "../components/ProductOV";

const publicRoutes = [
  { path: "/", component: ProductOV },
  { path: "/upload", component: Input },
  { path: "/result", component: Converter },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
