import {
  BufferGeometry,
  Clock,
  Color,
  Event,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import IvyScene from "../../../../v1/ivy-scene/IvyScene";
import IScene from "../../Scene/IScene";
import IEl, { IElOptions } from "../IEl";
import * as CANNON from "cannon-es";
import { Vec3 } from "math/Vec3";

interface IMeshOptions extends IElOptions {
  geometry: BufferGeometry;
  color?: number | Color;
  material?: Material | Material[];
  shadow?: boolean | "cast" | "receive";
  mass?: number;
}

const DEFAULT_MATERIAL = new MeshStandardMaterial({ color: 0xffffff });

export default class IMesh extends IEl {
  color: Color;
  o: IMeshOptions;
  geometry: BufferGeometry;
  material: Material | Material[];
  mesh: Mesh;
  shape?: CANNON.Shape;

  constructor(options: IMeshOptions) {
    super(options);
    this.o = options;
    this.geometry = options.geometry;
    this.color = new Color(options.color ?? 0xffffff);
    this.mesh = new Mesh(this.geometry, options.material ?? DEFAULT_MATERIAL);
    this.material = this.mesh.material;
    this.object = this.mesh;

    if (options.shadow === true) {
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
    } else if (options.shadow === "cast") {
      this.mesh.castShadow = true;
    } else if (options.shadow === "receive") {
      this.mesh.receiveShadow = true;
    }
  }

  init() {
    super.init();
    // this.material.color = this.color;
  }

  mount(scene: IScene) {
    super.mount(scene);

    if (this.scene?.world) {
      const { width, height, depth, radius } = this.geometry.parameters;
      const type = this.geometry.type;

      if (type === "BoxGeometry") {
        this.shape = new CANNON.Box(
          new CANNON.Vec3(width / 2, height / 2, depth / 2)
        );
      }

      if (type === "PlaneGeometry") {
        this.shape = new CANNON.Plane();
      }

      if (type === "SphereGeometry") {
        this.shape = new CANNON.Sphere(radius);
      }

      if (this.shape) {
        this.body = new CANNON.Body({ mass: this.o.mass ?? 0 });
        this.body.addShape(this.shape);
        const worldPos = this.object?.getWorldPosition(new Vector3());
        if (worldPos) {
          this.body.position.x = worldPos.x;
          this.body.position.y = worldPos.y;
          this.body.position.z = worldPos.z;
        }
        this.body.quaternion.setFromEuler(this.rot.x, this.rot.y, this.rot.z);
        this.scene.world.addBody(this.body);
      }
    }
  }

  setMaterial(material: Material | Material[]) {
    this.mesh.material = material;
    this.material = material;
  }

  updatePhysics = (el: IEl, clock: Clock) => {
    if (!this.body || typeof this.o.mass !== "number") return;
    const pos = this.getLocalBodyPosition(this.body.position);
    this.pos.copy(pos);
    this.mesh.quaternion.set(
      this.body.quaternion.x,
      this.body.quaternion.y,
      this.body.quaternion.z,
      this.body.quaternion.w
    );
  };

  dispose(): void {
    super.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.mesh.parent?.remove(this.mesh);

    // remove CANNON object from world
    if (this.scene?.world && this.body) {
      this.scene.world.removeBody(this.body);
    }
  }
}
