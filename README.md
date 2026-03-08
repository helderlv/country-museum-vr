## Starter Template
This project is built upon the [Vue + A-Frame + Vite boilerplate](https://github.com/Chabloz/a-frame-vite-vue-boilerplate) created by [Chabloz](https://github.com/Chabloz).

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![A-Frame](https://img.shields.io/badge/A%E2%80%93Frame-brightgreen?style=for-the-badge&labelColor=%23ef2d5e&color=%23ef2d5e)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)


<h1>Country Museum VR</h1>

**Country Museum VR** is an interactive journey built for VR. You are transported into a secret cultural exhibition and invited to look around. Take your time to examine the 3D historical artifacts, read the informative plaques, and listen to the audio hints to guess which country is being showcased. Once you piece all the clues together, simply locate the mystery destination on a fully interactive globe to complete your experience.

 ### [>> DEMO <<](https://vr.onivers.com/helder/)



## Movement modes support

This experience supports multiple devices.

- **Desktop**
  - **Move:** Use WASD or ZQSD (Arrow keys also supported)
  - **Look:** Mouse (Click and drag)
  - **Interact:** Left Click
  - **Rotate the Globe:** Hold Right Click and drag the mouse

- **VR Headset**
  - **Move:** Use the left joystick
  - **Interact:** Use the right trigger
  - **Rotate the Globe:** Use the right joystick


## Assets
### 3D models

- **Exhibition Room** (`vr_exhibition_gallery_baked.glb`) – [VR Exhibition Gallery](https://www.fab.com/fr/listings/3922d2eb-efef-49a9-9017-ee510c6260b5) by Christy Hsu Creative is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Interactive Earth** (`earth.glb`) – [Solar Impulse Flight Path](https://sketchfab.com/3d-models/solar-impulse-flight-path-298e1ac1fdb048e892d036d588d4322c) by Solar Impulse is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Display Stand** (`stand_low_poly.glb`) – [Stand Low Poly](https://www.fab.com/fr/listings/0fdf7114-37af-4811-bffd-743d64086f87) by Oobe-Xr-Srl is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Calendar Frame** (`frame_calendar.glb`) – [Picture Frame](https://sketchfab.com/3d-models/picture-frame-5b4f6ab0cd54433c82b429b42f4c9259) by Wyme is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Picture Frame** (`picture_frame_-_emapale_enmarcate.glb`) – [Emapale Enmarcate](https://sketchfab.com/3d-models/picture-frame-emapale-enmarcate-1e2b479db01c4a5d93a79ed94fd08bff) by chayaruart is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Kirar / Traditional Lyre** (`kirar-v1.glb`) – [Kirar](https://sketchfab.com/3d-models/kirar-6f96fc4ee4224729b9e3d37ebb27287e) by Binu Darker is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Jebena / Coffee Pot** (`jebena_model.glb`) – [Jebena Model](https://sketchfab.com/3d-models/jebena-model-5aa1771df2294e9f82c32def2088304a) by Johntesfu is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Interactive Button** (`button.glb`) – [Low Poly Button](https://sketchfab.com/3d-models/low-poly-button-optimized-for-roblox-51456146478740dba6469a4c04435c3c) by Matrix1635 is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

---

## Quickstart

### Create a folder for your project and move to it

### Clone (or fork, or download)

```sh
git clone https://github.com/helderlv/country-museum-vr.git
```

### Install dependencies

```sh
npm ci
```

### Dev

```sh
npm run dev
```

### Build

```sh
npm run build
```

## Notes for local dev on VR headset

1. Check that your development device and your VR headset are connected on **the same network**.

2. Expose you local development:

```sh
npm run dev-expose
```

3. In your VR headset, browse to the local development adress `[ip]:[port]`.

> [!NOTE]
> The certificate is self-signed, so you will probably have to confirm access to the resource in your browser.

---
