import{t as s,V as o,y as t}from"./vendor.cc2cfa35.js";import{d as r}from"./defaultLights.27a53020.js";import{I as d,a}from"./IvyScene.bf968ae4.js";const e=new d("Shadow Scene");e.add(...r());e.add(new a({geometry:new s(10,1,10),pos:new o(0,-2,0),rot:new t(0,.1,0),name:"floor",shadow:!0}));e.add(new a({name:"box",pos:new o(-.5,0,0),shadow:!0,color:991475}));export{e as default};
