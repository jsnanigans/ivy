import { AmbientLight, DirectionalLight, Vector3 } from "three";
import IvyObject from "./ivy-object/IvyObject";

const lightA = () =>
  new IvyObject({
    name: "lightA",
    pos: new Vector3(2, 4, -1),
    light: new DirectionalLight(0xffffff, 1),
    shadow: true,
  });

const lightB = () =>
  new IvyObject({
    name: "lightB",
    light: new AmbientLight(0xffffff, 0.3),
  });

export default () => [lightA(), lightB()];