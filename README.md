# Connus

## Usage

### Development

Ensure MongoDB instance is running and run **development mode**

```
> yarn start
```

With _Docker_

```
> docker run -v ~/${PATH}/connus/src:/usr/src/app/src -p 8080:8080 connus:v1.0
```

### Production

For production run

```
> yarn start:prod
```

With _Docker_

```
> # Comming soon
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

## Licence

MIT
