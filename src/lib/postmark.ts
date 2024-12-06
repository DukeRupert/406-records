import { POSTMARK_API_TOKEN } from '$env/static/private'
import postmark from 'postmark'

var postmarkClient = new postmark.ServerClient(POSTMARK_API_TOKEN);

export default postmarkClient