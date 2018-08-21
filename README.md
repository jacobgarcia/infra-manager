# Connus
## Installation
  +Clone Repository
  +install Docker
  +install nginx (optional) 

## Usage

### Development

Ensure MongoDB instance is running and run **development mode**

```
> yarn start
```

### Production

For production run

```
yarn build:prod
PORT=8080 NODE_ENV=production HOST=52.72.2.200 pm2 start ecosystem.json
```

_With Docker_, builds up with **node** and **mongo**

```
> docker-compose up --build # IMPORTANT Omit the --build if not the first build
```
## Codes

**Services**

| Code | Name               |
| ---- | ------------------ |
| 00   | Sites              |
| 01   | Accesses           |
| 02   | Vehicular Flow     |
| 03   | Perimeter          |
| 04   | Facial Recognition |
| 05   | CCTV               |

**Access**

| Code | Name             |
| ---- | ---------------- |
| 0    | Guest            |
| 1    | Company user     |
| 2    | Company admin    |
| 3    | Company register |
| 4    | Connus user      |
| 5    | Connus admin     |

**Environment Variables**

| Name      | Default     |
| ---------- | ------------- |
| MONGODB_URL | mongodb://localhost:27017/kawlantid            |
| NODE_ENV | development               |
| HOST | 0.0.0.0                  |
| PORT | 8080            |


## Licence

MIT
