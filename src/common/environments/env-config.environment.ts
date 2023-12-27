export default () => ({
    port: process.env.PORT,
    app_mode: process.env.APP_MODE,
    
    database: {
        db_password: process.env.DB_PASSWORD,
        db_type: process.env.DB_TYPE,
        db_host: process.env.DB_HOST,
        db_name: process.env.DB_NAME,
        db_port: process.env.DB_PORT,
        db_user: process.env.DB_USER,
    },

    jwt: {
        exp: process.env.JWT_EXP,
        secret: process.env.JWT_SECRET,
    }
});