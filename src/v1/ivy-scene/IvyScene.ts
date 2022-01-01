import { AmbientLight, BoxGeometry, Camera, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, PerspectiveCamera, Scene } from "three";
import Ivy from "../Ivy";
import IvyObject from "../ivy-object/IvyObject";
import destroyObject from "../lib/destroyObject";

interface IvySceneOptions {
  physics?: boolean;
  gravity?: number;
  controls?: "orbit";
  camera?: Camera;
}

export default class IvyScene {
  loadedAt: number;
  name: string;
  options: IvySceneOptions;
  objectStack: Array<IvyObject | undefined> = [];
  threeScene = new Scene();
  core?: Ivy; 
  mounted = false;  
  onMount?: (camera: Camera) => void;
  onDestroy?: () => void;
  _tidyInterval = 0;

  constructor(name: string, options: IvySceneOptions = {}) {
    this.loadedAt = 0;
    this.options = options;
    this.name = name; 
  }
 
  add = (...objects: IvyObject[]) => {
    for (const object of objects) {
      object.scene = this;
      this.objectStack.push(object);

      if (this.mounted) {
        object.mount()
      } else {
        object.initialItem = true;
      }
    }
  }
 
  mount = () => {
    this.destroy(); 

    if (this.options.camera) {
      this.setMainCamera(this.options.camera);
    }

    this.mounted = true;
    for (const object of this.objectStack) {
      object?.mount();
    }
    if (this.core?.mainCamera) {
      this.onMount?.(this.core?.mainCamera);
    }
  }

  update = () => {
    for (const object of this.objectStack) {
      object?._active && object.update?.(object);
    }
  }
 
  setMainCamera = (camera: Camera) => {
    this.core?.setMainCamera(camera);
  }

  destroy = () => {
    this.mounted = false;
    this.onDestroy?.();
   
    const children = this.threeScene.children;
    for (const object of children) {
      destroyObject(object);
    }
    
    for (const object of this.objectStack) {
      object?.destroy();
    }

    this.objectStack = this.objectStack.filter(o => o?.initialItem);
  }
}