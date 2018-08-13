# Connus

## Usage

### Development

Ensure MongoDB instance is running and run **development mode**

```
> yarn start
```

_With Docker_, builds up with **node** and **mongo**

```
> docker-compose up --build # IMPORTANT Omit the --build if not the first build
```

### Production

For production run

```
> yarn start:prod
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
| NODE_ENV | none               |
| HOST | 0.0.0.0                  |
| PORT | 8080            |


## Licence

MIT
