import superagent from "superagent";
import { z } from "astro/zod";

// Options for the getJavaStatus function
export const getJavaStatusOptionsSchema = z.object({
    host: z.string(),
    port: z.number().optional(),
    options: z.object({
        query: z.boolean().optional(),
    }).optional(),
    apiUrl: z.string().optional(),
});

// Response schema for the status endpoint
export const StatusResponseSchema = z.object({
    online: z.boolean(),
    host: z.string(),
    port: z.number(),
    eula_blocked: z.boolean(),
    retrieved_at: z.number(),
    expires_at: z.number(),
});

// version schema for the Java server status response
export const versionSchema = z.object({
    name_raw: z.string(),
    name_clean: z.string(),
    name_html: z.string(),
    protocol: z.number().optional(),
}).nullable();

// player schema for the Java server status response
export const playerSchema = z.object({
    online: z.number(),
    max: z.number(),
    list: z.array(
        z.object({
            uuid: z.string(),
            name_raw: z.string(),
            name_clean: z.string(),
            name_html: z.string(),
        })
    ),
}).optional();

// motd schema for the Java server status response
export const motdSchema = z.object({
    raw: z.string(),
    clean: z.string(),
    html: z.string(),
}).optional();

// Java server status response schema for the getJavaStatus function
export const JavaStatusResponseSchema = StatusResponseSchema.merge(z.object({
    version: versionSchema,
    players: playerSchema,
    motd: motdSchema,
    icon: z.string().nullable(),
    mods: z.array(
        z.object({
            name: z.string(),
            version: z.string(),
        })
    ),
    plugins: z.array(
        z.object({
            name: z.string(),
            version: z.string(),
        })
    ),
    software: z.string().optional(),
}));

// Options for the getPlayer function
export const getPlayerSchema = z.object({
    uuid: z.string(),
    type: z.enum(["face", "head", "body"]),
});

// export types for the Schemas
export type PlayerOptions = z.infer<typeof getPlayerSchema>;
export type JavaStatusResponse = z.infer<typeof JavaStatusResponseSchema>;
export type StatusResponse = z.infer<typeof StatusResponseSchema>;
export type getJavaStatusOptions = z.infer<typeof getJavaStatusOptionsSchema>;

export async function getServerStatus(opts: getJavaStatusOptions): Promise<JavaStatusResponse> {
    const url = opts.apiUrl?opts.apiUrl:'https://api.mcstatus.io/v2';
    const ip = opts.host;
    const p = opts.port?opts.port:25565;
    const query = opts.options?.query?opts.options.query:true;

    const result = await superagent.get(`${url}/status/java/${ip}:${p}?query=${query ?? true}`);

    if (result.statusCode !== 200) {
        throw new Error(result.body);
    }

    return result.body as JavaStatusResponse;
}

export async function parseServerPlayers(serverStatus: JavaStatusResponse): Promise<JavaStatusResponse["players"]> {

    if (serverStatus?.online) {
        return serverStatus.players;
    }
    return {} as JavaStatusResponse["players"];
}

export async function parseServerMOTD(serverStatus: JavaStatusResponse): Promise<JavaStatusResponse["motd"]> {

    if (serverStatus?.online) {
        return serverStatus.motd;
    }
    return {} as JavaStatusResponse["motd"];
}

export const getJavaIcon = ( host: string, port = 25565 ): string => {
    const result = `https://api.mcstatus.io/v2/icon/${host}:${port}`;
    return result as string;
};

export const trimUUID = ( uuid: string ): string => {
    if (uuid.includes('-')) {
        const newUUID = uuid.replace(/-/g, '');
        return newUUID;
    }
    return uuid;
};

export const getPlayer = ( opts: PlayerOptions ): string => {
    if (opts.type === "face" || opts.type === "head"){
        const result = `https://api.mineatar.io/${opts.type}/${trimUUID(opts.uuid)}?scale=16`;
        return result;
    }
    if (opts.type === "body"){
        const result = `https://api.mineatar.io/body/full/${trimUUID(opts.uuid)}?scale=16`;
        return result;
    }
    throw new Error("Invalid type");
};

export const howLongAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return `${seconds} seconds ago`;
}