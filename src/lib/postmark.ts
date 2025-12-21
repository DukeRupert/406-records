import { env } from '$env/dynamic/private'
import postmark from 'postmark'

export function getPostmarkClient() {
    return new postmark.ServerClient(env.POSTMARK_API_TOKEN || '');
}