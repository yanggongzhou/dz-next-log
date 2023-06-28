# dz-next-log

Next 输出日志文件 logs

## Description
Then add a [`NODE_OPTIONS`](https://nextjs.org/docs/api-reference/cli) string to your Next.js start script, to require in the logger.

```sh
NODE_OPTIONS='-r dz-next-log' next start
```

### Adding to `package.json` Scripts

You can add this directly to your `package.json` scripts, to make it easier to start your service.

```
"scripts": {
    "dev": "NODE_OPTIONS='-r dz-next-log' next dev",
    "build": "next build",
    "start": "NODE_OPTIONS='-r next-logger' next start"
},
```

#### 参考： https://github.com/sainsburys-tech/next-logger
