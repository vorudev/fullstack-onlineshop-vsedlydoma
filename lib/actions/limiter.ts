'use server';
import {getIp} from "./get-ip";
import {auth} from "@/lib/auth";

const trackers: Record<string, {expiresAt: number, requestCount: number}> = {};

export async function rateLimitbyKey(
    key: string,
    limit: number,
    timeWindow: number
) { 

    const tracker = trackers[key] || { requestCount: 0, expiresAt: 0};
    if (!trackers[key]) {
        trackers[key] = tracker;
    }
    if (tracker.expiresAt < Date.now()) {
        tracker.requestCount = 0;
        tracker.expiresAt = Date.now() + timeWindow;
    }
    tracker.requestCount++;
    if (tracker.requestCount > limit) {
        throw new Error('Rate limit exceeded');
    }
}
export async function rateLimitbyIp(
    limit: number,
    timeWindow: number
) {
    const ip = await getIp();
    if (!ip) {
        throw new Error('IP not found');
    }
    const tracker = trackers[ip] || { requestCount: 0, expiresAt: 0};
    if (!trackers[ip]) {
        trackers[ip] = tracker;
    }
    if (tracker.expiresAt < Date.now()) {
        tracker.requestCount = 0;
        tracker.expiresAt = Date.now() + timeWindow;
    }
    tracker.requestCount++;
    if (tracker.requestCount > limit) {
        throw new Error('Rate limit exceeded');
    }
}
        