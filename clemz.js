!(function e(t, o, s) {
    function r(n, i) {
        if (!o[n]) {
            if (!t[n]) {
                var c = "function" == typeof require && require;
                if (!i && c) return c(n, !0);
                if (a) return a(n, !0);
                var l = new Error("Cannot find module '" + n + "'");
                throw ((l.code = "MODULE_NOT_FOUND"), l);
            }
            var u = (o[n] = { exports: {} });
            t[n][0].call(
                u.exports,
                function (e) {
                    return r(t[n][1][e] || e);
                },
                u,
                u.exports,
                e,
                t,
                o,
                s
            );
        }
        return o[n].exports;
    }
    for (var a = "function" == typeof require && require, n = 0; n < s.length; n++) r(s[n]);
    return r;
})(
    {
        1: [
            function (e, t, o) {
                const { t: s, o: r, i: a, l: n } = e("./utilities.js");
                async function i() {
                    const e = window.location.hostname;
                    let t = await fetch(`https://${e}/auth/token_refresh`, { headers: { accept: "application/json, text/plain, */*" }, body: null, method: "POST", credentials: "include" });
                    return t.status < 200 || t.status > 299
                        ? ((responseText = await t.text()),
                          chrome.runtime.sendMessage({
                              message: "error",
                              origin: "vinted",
                              uiMessage: "",
                              showUiMessage: !1,
                              devMessage: "AC-GT - status fail",
                              backtrace: JSON.stringify(t, ["status", "url", "data", "headers"]),
                              body: responseText.substring(0, 300),
                              showProgressUiError: !1,
                          }),
                          { errorMessage: !0 })
                        : "success";
                }
                async function c(e, t, o, r) {
                    let a = await s(["prodUrl", "userInfo"]),
                        n = a.prodUrl;
                    const i = a.userInfo.authentication_token,
                        c = a.userInfo.email,
                        l = { recorded_log: { activity_uid: r, message_clear: t, message_encrypted: o, category: "normal", title: e } };
                    try {
                        response = await fetch(`${n}/api/recorded_logs`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": c, "User-token": i }, body: JSON.stringify(l) });
                    } catch (e) {
                        return (
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "",
                                showUiMessage: !1,
                                devMessage: "AC-SL - code",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !1,
                            }),
                            "fail"
                        );
                    }
                    return response.status < 200 || response.status > 299
                        ? (chrome.runtime.sendMessage({
                              message: "error",
                              origin: "vinz",
                              uiMessage: "Erreur de com avec clemz.app (erreur AC-SL)",
                              devMessage: "AC-SL - status fail",
                              backtrace: JSON.stringify(response, ["status", "url", "data", "headers"]),
                              showUiMessage: !1,
                          }),
                          "fail")
                        : "success";
                }
                async function l(e) {
                    let t,
                        o = "",
                        s = "status fail",
                        r = await e.text();
                    try {
                        t = JSON.parse(r);
                    } catch (e) {}
                    if (
                        (401 == e.status ? (s = "token_expired") : 403 == e.status ? (s = "forbidden") : 404 == e.status && "not_found" == t?.message_code ? (s = "not_found") : e.status >= 500 && (s = "vinted_error"), t?.errors?.length > 0)
                    ) {
                        (o += "Vinted dit:"), (s = "detailed_error");
                        for (let e of t.errors) e && e.value && (o += `"${e.value}" `);
                    }
                    return { errorAdditionalInfo: o, errorType: s, responseText: r, responseJSON: t, status: e.status };
                }
                async function u(e) {
                    if (e.status < 200 || e.status > 299)
                        return (
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "vinz",
                                uiMessage: "<b>Erreur de com avec clemz.app</b><br>Contactez clement@clemz.app si cela persiste",
                                devMessage: "AC-GUI - status fail",
                                backtrace: JSON.stringify(e, ["status", "url", "data", "headers"]),
                                showUiMessage: !0,
                            }),
                            "fail"
                        );
                    let t = await e.json();
                    if ("forbidden" == t.is_success) return chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail";
                    if ("success" != t.is_success) return chrome.storage.local.set({ globalUiMessage: { content: t.data.message_content, type: t.data.message_type } }), t.data.profile_url && (await d(t)), "fail";
                    {
                        let e = t.data.upload_photo,
                            o = t.data.access_modified_photo,
                            s = t.data.active_alerts_array;
                        return await chrome.storage.local.set({ uploadPhoto: e, accessModifiedPhoto: o, activeAlertsArray: s }), await d(t), "success";
                    }
                }
                async function d(e) {
                    const t = await s(["userInfo", "autoMessageParams"]);
                    let o = t.userInfo,
                        r = t.autoMessageParams;
                    null == r && (r = { firstMessage: "", secondMessage: "", excludedVinties: "" }),
                        (o.profileUrl = e.data.profile_url),
                        (o.username = e.data.username),
                        (o.subscription = e.data.subscription),
                        (o.role = e.data.role),
                        (o.activeLogs = e.data.active_logs),
                        (o.repostLeft = e.data.repost_left),
                        (o.nextTopUp = e.data.next_top_up),
                        (o.maxRepostLeft = e.data.max_repost_left),
                        (o.maxViews = e.data.max_views),
                        (o.maxFavsPerRequest = e.data.max_favs_per_request),
                        (o.lastRequestFavs = e.data.last_request_favs),
                        (o.autoMessageAllowed = e.data.auto_message_allowed),
                        (o.autoMessageMaxDuration = e.data.auto_message_max_duration),
                        (o.autoMessageLeft = e.data.auto_message_left),
                        (o.autoMessageIncluded = e.data.auto_message_included),
                        (o.status = e.data.status),
                        (o.newTrialLaunchedToday = e.data.new_trial_launched_today),
                        (o.updatedAt = Date.now()),
                        null != e.data.auto_message_first && (r.firstMessage = e.data.auto_message_first),
                        null != e.data.auto_message_second && (r.secondMessage = e.data.auto_message_second),
                        null != e.data.auto_message_excluded_vinties && (r.excludedVinties = e.data.auto_message_excluded_vinties.split(";")),
                        await chrome.storage.local.set({ userInfo: o, autoMessageParams: r });
                }
                t.exports = {
                    u: i,
                    m: async function e(t, o, s, r, n) {
                        const l = window.location.hostname;
                        let u;
                        n || (n = 0);
                        try {
                            u = await fetch(`https://${l}/api/v2/users/${t}/items?per_page=${o}&page=${s}&order=relevance`, {
                                headers: { accept: "application/json, text/plain, */*" },
                                body: null,
                                method: "GET",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (i) {
                            if (n < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${n} ---- ${JSON.stringify(i, Object.getOwnPropertyNames(i))}`,
                                        "MAhPBUWPreGGi3wPzJw5kT4tYC6KWZKYJS+SFXSa/3XEFMeLz7UlecT8lJykUbo2e/RSF9sZ--cA1Cha9ElE1WxqTD--uhqrp8apVv098AsVH8s/OA==",
                                        r
                                    ),
                                    e(t, o, s, r, n + 1)
                                );
                            throw i;
                        }
                        return u.status < 200 || u.status > 299
                            ? 401 == u.status && n < 3
                                ? (await i(), e(t, o, s, r, n + 1))
                                : u.status >= 500 && n < 3
                                ? (await a(600), e(t, o, s, r, n + 1))
                                : ((responseText = await u.text()),
                                  chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: "<b>Erreur en récupérant les articles<b><br>Veuillez réessayer",
                                      showUiMessage: !0,
                                      devMessage: "AC-FUI - status fail",
                                      backtrace: JSON.stringify(u, ["status", "url", "data", "headers"]),
                                      body: responseText.substring(0, 300),
                                      showProgressUiError: !0,
                                  }),
                                  { errorMessage: !0 })
                            : ((responseJSON = await u.json()),
                              null == responseJSON.items
                                  ? (chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "vinted",
                                        uiMessage: "Erreur en récupérant les articles",
                                        showUiMessage: !0,
                                        devMessage: "AC-FUI - empty",
                                        backtrace: JSON.stringify(u, ["status", "url", "data", "headers"]),
                                        body: "",
                                        showProgressUiError: !0,
                                    }),
                                    { errorMessage: "empty" })
                                  : responseJSON);
                    },
                    g: async function e(t, o, s, r, n, l, u) {
                        const d = window.location.hostname;
                        let m;
                        n || (n = "AC-FA"), u || (u = 0);
                        try {
                            m = await fetch(`https://${d}/api/v2/items/${t}`, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                },
                                body: null,
                                method: "GET",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (i) {
                            if (u < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${u} ---- ${JSON.stringify(i, Object.getOwnPropertyNames(i))}`,
                                        "0iL1FDFpQ1AFIDersPOCWZIr/ZeAGl42sujG5DCXV91mxajkln0CiKsZE2kHiK7XwzB+6Q==--lF2UQCF2y7K2ydab--pU5SJMQEleFCWhD0NJdYgw==",
                                        l
                                    ),
                                    e(t, o, s, r, n, l, u + 1)
                                );
                            throw i;
                        }
                        if (m.status < 200 || m.status > 299) {
                            if (401 == m.status && u < 3) return await i(), e(t, o, s, r, n, l, u + 1);
                            if (r && 404 == m.status && u < 3) return await a(1e3), e(t, o, s, r, n, l, u + 1);
                            if (m.status >= 500 && u < 3) return await a(600), e(t, o, s, r, n, l, u + 1);
                            let c,
                                d = await m.text();
                            try {
                                c = JSON.parse(d);
                            } catch (e) {}
                            return (
                                (errorMessage = `Erreur en récupérant l'article "${o}"`),
                                404 == m.status && c && "not_found" == c.message_code
                                    ? (chrome.runtime.sendMessage({
                                          message: "error",
                                          origin: "vinted",
                                          uiMessage: "",
                                          showUiMessage: !1,
                                          devMessage: `${n} - status fail'${o}'`,
                                          backtrace: JSON.stringify(m, ["status", "url", "headers"]),
                                          body: d.substring(0, 300),
                                          showProgressUiError: !1,
                                      }),
                                      { errorMessage: errorMessage, errorType: "not_found" })
                                    : (chrome.runtime.sendMessage({
                                          message: "error",
                                          origin: "vinted",
                                          uiMessage: errorMessage,
                                          showUiMessage: !1,
                                          devMessage: `AC-FA - status fail'${o}'`,
                                          backtrace: JSON.stringify(m, ["status", "url", "headers"]),
                                          body: d.substring(0, 300),
                                          showProgressUiError: s,
                                      }),
                                      { errorMessage: errorMessage })
                            );
                        }
                        return (responseJson = await m.json()), responseJson;
                    },
                    p: async function e(t, o, s, u, d, m) {
                        const g = r(),
                            p = window.location.hostname,
                            f = n();
                        s || (s = "AC-PP");
                        let h = [],
                            b = JSON.parse(JSON.stringify(o)),
                            w = t.length,
                            M = 0;
                        for (photoBlob of t) {
                            M++,
                                o && ((b.stage = `${o.stage} (${Math.round((M / w) * 50 + 50)}%)`), chrome.storage.local.set({ progressUiMessage: b })),
                                (formData = new FormData()),
                                formData.append("photo[type]", "item"),
                                formData.append("photo[file]", photoBlob),
                                formData.append("photo[temp_uuid]", g),
                                m || (m = 0),
                                d &&
                                    c(
                                        "xhhp9kvNeJgsYfDWVzSGUx9/UtcFUINRbemEMw==--bhtg3O2P8HUQ2XKY--QDjGpxfVWQDJfAHUYl8jog==",
                                        `${m} - ${M}`,
                                        "0HaLn3nqDeMQZo6lrEL5euuI6H+0VuBlJh8vrK2rkPNVjOBAIzWcf9fefAEjopGNXDbLBJny3D1sXgRCQKYL--XFyTS1CuU7Vkrusm--nX8A84ZDpUFPS2NCjMtziQ==",
                                        u
                                    );
                            try {
                                response = await fetch(`https://${p}/api/v2/photos`, {
                                    headers: {
                                        accept: "application/json, text/plain, */*",
                                        "cache-control": "no-cache",
                                        pragma: "no-cache",
                                        "sec-fetch-dest": "empty",
                                        "sec-fetch-mode": "cors",
                                        "sec-fetch-site": "same-origin",
                                        "x-csrf-token": f,
                                    },
                                    body: formData,
                                    method: "POST",
                                    mode: "cors",
                                    credentials: "include",
                                });
                            } catch (r) {
                                if (m < 3)
                                    return (
                                        await a(500),
                                        c(
                                            "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                            `${m} ---- ${JSON.stringify(r, Object.getOwnPropertyNames(r))}`,
                                            "jlsq0YmubKW77JZCuagfEZ0UpFxbya5tqEnbDo/ZK/Q9RaFUZ/QPueGgdm9ehjh7hKg=--bVMWkKKhAOPDbOMu--7W9LXnIZ41ZNWCbKMvJ4sA==",
                                            u
                                        ),
                                        e(t, o, s, u, d, m + 1)
                                    );
                                throw r;
                            }
                            if (response.status < 200 || response.status > 299) {
                                let r = await l(response),
                                    n = !0;
                                if ("token_expired" == r.errorType && m < 3)
                                    return (
                                        await i(),
                                        c(
                                            "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                            `${m} ---- ${JSON.stringify(r, Object.getOwnPropertyNames(r))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                            "0+FfDvvb6bLnFYm3HExLowlrlVvWgaCU/QT5dLhITwjZGJq5DGV8EkaA9rH77lq/ioJH7bJ9XHo1atFWTcbYQlWvNfDCwwFvbIpZ--k7QW1fMS5aD9krDI--vhRxHZV2CDisNC8GMIgWCQ==",
                                            u
                                        ),
                                        e(t, o, s, u, d, m + 1)
                                    );
                                if ("forbidden" == r.errorType) {
                                    if (!(m >= 3))
                                        return (
                                            await i(),
                                            c(
                                                "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                                `${m} ---- ${JSON.stringify(r, Object.getOwnPropertyNames(r))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                                "0+FfDvvb6bLnFYm3HExLowlrlVvWgaCU/QT5dLhITwjZGJq5DGV8EkaA9rH77lq/ioJH7bJ9XHo1atFWTcbYQlWvNfDCwwFvbIpZ--k7QW1fMS5aD9krDI--vhRxHZV2CDisNC8GMIgWCQ==",
                                                u
                                            ),
                                            e(t, o, s, u, d, m + 1)
                                        );
                                    n = "<b>Vinted vous refuse la connexion au serveur photo</b><br>Essayez de vous déconnecter de votre compte Vinted puis vous reconnecter";
                                }
                                if ("vinted_error" == r.errorType) {
                                    if (!(m >= 3))
                                        return (
                                            await a(600),
                                            c(
                                                "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                                `${m} ---- ${JSON.stringify(r, Object.getOwnPropertyNames(r))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                                "0+FfDvvb6bLnFYm3HExLowlrlVvWgaCU/QT5dLhITwjZGJq5DGV8EkaA9rH77lq/ioJH7bJ9XHo1atFWTcbYQlWvNfDCwwFvbIpZ--k7QW1fMS5aD9krDI--vhRxHZV2CDisNC8GMIgWCQ==",
                                                u
                                            ),
                                            e(t, o, s, u, d, m + 1)
                                        );
                                    n = "<b>Le serveur photo Vinted buggue 🪳</b><br>Attendez un peu avant de réessayer";
                                }
                                let g = r.responseText,
                                    p = (r.responseJSON, r.errorType),
                                    f = r.errorAdditionalInfo;
                                return (
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "vinted",
                                        uiMessage: "",
                                        showUiMessage: !1,
                                        devMessage: `${s} - ${p} - status fail`,
                                        backtrace: JSON.stringify(response, ["status", "url", "data", "headers"]),
                                        body: g.substring(0, 300),
                                    }),
                                    { errorMessage: n, errorType: p, errorAdditionalInfo: f, response: JSON.stringify(response, ["status", "url", "data", "headers"]) }
                                );
                            }
                            (responseJson = await response.json()),
                                d &&
                                    c(
                                        "CoK3FVy3qF/auB2tAYx0UjvzSPnhD7FXv0LsGx3Zig3RS6k=--HiaMMXhOGnGMA+7S--ts592Oxx5tJVOt1Ca/mK/w==",
                                        `${JSON.stringify(responseJson)}`,
                                        "n/Ph/oT50Sd7DFY7nDPYub5uKpMP--fs1TH/0q69AKNakh--nlIm2m4ZFS/WUUvsG4jGwA==",
                                        u
                                    ),
                                h.push(responseJson.id);
                        }
                        return h;
                    },
                    h: async function e(t, o, s, r, u, d) {
                        let m, g;
                        const p = window.location.hostname,
                            f = n();
                        if (s) for (photoId of ((m = "/drafts"), (g = { draft: t }), (g.draft.assigned_photos = []), o)) g.draft.assigned_photos.push({ id: photoId, orientation: 0 });
                        else for (photoId of ((m = ""), (g = { item: t }), (g.item.assigned_photos = []), o)) g.item.assigned_photos.push({ id: photoId, orientation: 0 });
                        (bodyString = JSON.stringify(g)),
                            d || (d = 0),
                            u &&
                                c(
                                    "xhhp9kvNeJgsYfDWVzSGUx9/UtcFUINRbemEMw==--bhtg3O2P8HUQ2XKY--QDjGpxfVWQDJfAHUYl8jog==",
                                    `${d} - ${bodyString}`,
                                    "YNndXr0iOURt396GcdHmObznr187KPtIh5DSMG8KpHo1RfzgE6TJ+ksEKuUPDRqGuYTGgp5BFsM=--ZPUtjE0kRJ+bqnXJ--IcfICvM9cemM2uk1EmJjSA==",
                                    r
                                );
                        try {
                            response = await fetch(`https://${p}/api/v2/items${m}`, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "none",
                                    "x-csrf-token": f,
                                },
                                body: bodyString,
                                method: "POST",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (n) {
                            if (d < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "8JjstFM2b8ZYnbRmVUc9+a2Ad2U4QcU2Tvg+S3HHqjOblK8ngna9teZfmqPERn5tLQuo--7xDaITh05eLOOwa0--O/iR/PiWy8jGW3FDsSQ75w==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            throw n;
                        }
                        if (response.status < 200 || response.status > 299) {
                            let n = await l(response),
                                m = !0;
                            if ("token_expired" == n.errorType && d < 3)
                                return (
                                    await i(),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "45bHayZlqXbB22A9MVLgnK8DAJ+ndaPNMdcubJ1UBUSV5/li2pTTorYI0dRS8w4pYYZIAIDaQLp8LuH4sRKTQ3oJbtZOGm4t5JJdsA==--kyHYZBvRetcPpN6Y--3vvmSkUx+Xn7GQXjrVDIJg==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            if ("vinted_error" == n.errorType && d < 3)
                                return (
                                    await a(600),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d}  ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ----  ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "45bHayZlqXbB22A9MVLgnK8DAJ+ndaPNMdcubJ1UBUSV5/li2pTTorYI0dRS8w4pYYZIAIDaQLp8LuH4sRKTQ3oJbtZOGm4t5JJdsA==--kyHYZBvRetcPpN6Y--3vvmSkUx+Xn7GQXjrVDIJg==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            let g = n.responseText,
                                p = (n.responseJSON, n.errorType),
                                f = n.errorAdditionalInfo;
                            return (
                                (articleType = s ? "le brouillon" : "l'annonce"),
                                1 == m && (m = `<b>Erreur en créant ${articleType} de "${t.title.slice(0, 30)}"</b><br> ${f}`),
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinted",
                                    uiMessage: "",
                                    showUiMessage: !1,
                                    devMessage: `AC-PA - ${p} - '${t.title}'`,
                                    backtrace: JSON.stringify(response, ["status", "url", "data", "headers"]),
                                    body: g.substring(0, 300),
                                }),
                                { errorMessage: m, errorType: p, errorAdditionalInfo: f, response: JSON.stringify(response, ["status", "url", "data", "headers"]) }
                            );
                        }
                        return (
                            (responseJson = await response.json()),
                            u &&
                                c(
                                    "CoK3FVy3qF/auB2tAYx0UjvzSPnhD7FXv0LsGx3Zig3RS6k=--HiaMMXhOGnGMA+7S--ts592Oxx5tJVOt1Ca/mK/w==",
                                    `${JSON.stringify(responseJson)}`,
                                    "ulT6+rWQ5iTkct5e6mryTOFhD/cGJQ==--9XS+nv8t+iMePE2U--E5WkSRqizpKM6owHDQlTDA==",
                                    r
                                ),
                            responseJson
                        );
                    },
                    M: async function e(t, o, s, r, u, d, m) {
                        const g = window.location.hostname,
                            p = n();
                        r || (r = "AC-UAr");
                        let f = "",
                            h = { item: t };
                        (t.id = s),
                            "draft" == o && ((f = "/drafts"), (h = { draft: t })),
                            (bodyString = JSON.stringify(h)),
                            m || (m = 0),
                            d &&
                                c(
                                    "xhhp9kvNeJgsYfDWVzSGUx9/UtcFUINRbemEMw==--bhtg3O2P8HUQ2XKY--QDjGpxfVWQDJfAHUYl8jog==",
                                    `${m} - ${bodyString}`,
                                    "Z6GD3sVR051lISP0lIgxTd52JLUIarfJN/ln8gEQcBPQhIyHcZd3Kd72aE3wV+WB2S3/VnD0AkPGWw==--kVer29Z7UCXZllZQ--tCjdLw4GWGcsY1DJzZ9sBA==",
                                    u
                                );
                        try {
                            response = await fetch(`https://${g}/api/v2/items${f}/${s}`, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "none",
                                    "x-csrf-token": p,
                                },
                                body: bodyString,
                                method: "PUT",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (n) {
                            if (m < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${m} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "F0qt3PHkvXEJxJwJXE2MDqKgSMXb2d5HKx84DFg2Ri1WYRXhI5cFMn1DnP8kTF51TWEID7M=--SrKDx6QgV7lgH6CB--cCKd5WoWWPH3KGVpT+IG6g==",
                                        u
                                    ),
                                    e(t, o, s, r, u, d, m + 1)
                                );
                            throw n;
                        }
                        if (response.status < 200 || response.status > 299) {
                            let n = await l(response);
                            if ("token_expired" == n.errorType && m < 3)
                                return (
                                    await i(),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${m}  ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ----  ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "uBdrB2KzVfYrNTx9mHqvYAxB+B0T5w5n1LL+LGxAss/pfsjoVxlTwfm9s13/6ux6EG/ukRRxnz3aHp//m97HX1wq5r/hZHkTjpMEnGmL--VCrvygh4kMsx7HxV--DYR11Cws/NcsobNvc8QoeQ==",
                                        u
                                    ),
                                    e(t, o, s, r, u, d, m + 1)
                                );
                            if ("vinted_error" == n.errorType && m < 3)
                                return (
                                    await a(600),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${m}  ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ----  ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "uBdrB2KzVfYrNTx9mHqvYAxB+B0T5w5n1LL+LGxAss/pfsjoVxlTwfm9s13/6ux6EG/ukRRxnz3aHp//m97HX1wq5r/hZHkTjpMEnGmL--VCrvygh4kMsx7HxV--DYR11Cws/NcsobNvc8QoeQ==",
                                        u
                                    ),
                                    e(t, o, s, r, u, d, m + 1)
                                );
                            let g = n.responseText,
                                p = (n.responseJSON, n.errorType),
                                f = n.errorAdditionalInfo;
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinted",
                                    uiMessage: "",
                                    showUiMessage: !1,
                                    devMessage: `${r} - ${p} - '${t.title}'`,
                                    backtrace: JSON.stringify(response, ["status", "url", "headers"]),
                                    body: g.substring(0, 300),
                                    showProgressUiError: !1,
                                }),
                                { errorMessage: !0, errorType: p, errorAdditionalInfo: f, response: JSON.stringify(response, ["status", "url", "data", "headers"]) }
                            );
                        }
                        return (
                            (responseJson = await response.json()),
                            d &&
                                c(
                                    "CoK3FVy3qF/auB2tAYx0UjvzSPnhD7FXv0LsGx3Zig3RS6k=--HiaMMXhOGnGMA+7S--ts592Oxx5tJVOt1Ca/mK/w==",
                                    `${JSON.stringify(responseJson)}`,
                                    "QfhAztIl0istfakJe0n/ilao28O2FROg--8fy53Ac5HtST/GHZ--kT22UxQ3mmLpolJTq7QfMQ==",
                                    u
                                ),
                            responseJson
                        );
                    },
                    v: async function e(t, o, s, r, u, d) {
                        const m = window.location.hostname,
                            g = n();
                        s || (s = "AC-DA"),
                            d || (d = 0),
                            u &&
                                c(
                                    "xhhp9kvNeJgsYfDWVzSGUx9/UtcFUINRbemEMw==--bhtg3O2P8HUQ2XKY--QDjGpxfVWQDJfAHUYl8jog==",
                                    `${d} - ${t} - ${o}`,
                                    "r3oiUdq+uwZjhHkV1DzEZkBqXi4M1c5MFJ90/dbeVxO6k69Z6HXeb7Q6x4RRxB99tD7hAZyvHYtgmEtUz7JeUrLE7b5XlVQH--IQki012WgmtIrq9H--6loiEPhA4XZR9/RxqZNQvQ==",
                                    r
                                );
                        try {
                            response = await fetch(`https://${m}/api/v2/items/${t}/delete`, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "accept-language": "en-US,en;q=0.9,fr;q=0.8",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "none",
                                    "x-csrf-token": g,
                                },
                                body: "{}",
                                method: "POST",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (n) {
                            if (d < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "HxNYi2Dm37yMjM/LNtZcdC3AJREmZkfAuhWmVlqV82DI4wPq1OrWM3QY7x2LAAKEzBpoi/w=--ahG4Yq6iNsbkIuYb--PdcCLP3I36jwRUefzm+iwA==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            throw n;
                        }
                        if (response.status < 200 || response.status > 299) {
                            let n = await l(response);
                            if ("token_expired" == n.errorType && d < 3)
                                return (
                                    await i(),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "8mG8COJEeKbKaYrsfM8/sr22cM8RpVwgFb0YRZWh/VNj3HTgPp3IwbwIXRlVSMzW62qKjYZf1vaHenpdGGYtwwxeI4uxcVkh/58xG1nk--Y610y6PWdf4z1km2--+JzoNWIzJsPtO8MkCksogQ==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            if ("vinted_error" == n.errorType && d < 3)
                                return (
                                    await a(600),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "8mG8COJEeKbKaYrsfM8/sr22cM8RpVwgFb0YRZWh/VNj3HTgPp3IwbwIXRlVSMzW62qKjYZf1vaHenpdGGYtwwxeI4uxcVkh/58xG1nk--Y610y6PWdf4z1km2--+JzoNWIzJsPtO8MkCksogQ==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            let m = n.responseText,
                                g = (n.responseJSON, n.errorType),
                                p = n.errorAdditionalInfo,
                                f = `<b>Erreur en supprimant "${o.slice(0, 30)}"</b><br> ${p}`;
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinted",
                                    uiMessage: f,
                                    showUiMessage: !1,
                                    devMessage: `${s} - ${g} - '${o}'`,
                                    backtrace: JSON.stringify(response, ["status", "url", "data", "headers"]),
                                    body: m.substring(0, 300),
                                }),
                                { errorMessage: f, errorType: g, errorAdditionalInfo: p, response: JSON.stringify(response, ["status", "url", "data", "headers"]) }
                            );
                        }
                        return (
                            (responseJson = await response.json()),
                            u &&
                                c(
                                    "CoK3FVy3qF/auB2tAYx0UjvzSPnhD7FXv0LsGx3Zig3RS6k=--HiaMMXhOGnGMA+7S--ts592Oxx5tJVOt1Ca/mK/w==",
                                    `${JSON.stringify(responseJson)}`,
                                    "eZP+l8X6RJBXfFfAvbqzLza5WwSFfiWR--mQawSI5zlXo3fPeY--1T2qHGn5VHLwlGcTldCYlQ==",
                                    r
                                ),
                            responseJson
                        );
                    },
                    U: async function e(t, o, s, r, u, d) {
                        const m = window.location.hostname,
                            g = n();
                        s || (s = "AC-SD");
                        let p = { draft: t };
                        for (photoId of ((p.draft.assigned_photos = []), o)) p.draft.assigned_photos.push({ id: photoId, orientation: 0 });
                        (bodyString = JSON.stringify(p)),
                            d || (d = 0),
                            u &&
                                c(
                                    "xhhp9kvNeJgsYfDWVzSGUx9/UtcFUINRbemEMw==--bhtg3O2P8HUQ2XKY--QDjGpxfVWQDJfAHUYl8jog==",
                                    `${d} - ${bodyString}`,
                                    "7KFlVFO9U0BpN3Ts15m5LmW6jKJBkTSz4r/Klb/bZbdITFpTT14spOn039Z6CsFuPb3elLIFl6s=--lTgdP+WR7FXuc/Xb--GGtEk558tiCWIj4Av5TfcQ==",
                                    r
                                );
                        try {
                            response = await fetch(`https://${m}/api/v2/items/drafts/${t.id}/completion`, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "none",
                                    "x-csrf-token": g,
                                },
                                body: bodyString,
                                method: "POST",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (n) {
                            if (d < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "4SiEMj8lj0P4P4SU0C4QkmlYyWpyLE4iOj/6x2156lpofDJESsFOn7tHewhpHxHLf/RJ--zU995pDkvMqVn8xF--Df3VWgceo8PgB2xy68kqJw==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            throw n;
                        }
                        if (response.status < 200 || response.status > 299) {
                            let n = await l(response);
                            if ("token_expired" == n.errorType && d < 3)
                                return (
                                    await i(),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "8uPGWtxd/Gha0bmLeQvC+y50jemkVhaXAoaKO4bwcD69FKYOjFKDlJqmXmwi5n6b8j+OFZ/zicFVNiiHROJtJhdcEBVvnUhjfv2xNg==--/XrZQYLWftIzIhgB--b3M2DU140GMid3YnJKrpNA==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            if ("vinted_error" == n.errorType && d < 3)
                                return (
                                    await a(600),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${d} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "8uPGWtxd/Gha0bmLeQvC+y50jemkVhaXAoaKO4bwcD69FKYOjFKDlJqmXmwi5n6b8j+OFZ/zicFVNiiHROJtJhdcEBVvnUhjfv2xNg==--/XrZQYLWftIzIhgB--b3M2DU140GMid3YnJKrpNA==",
                                        r
                                    ),
                                    e(t, o, s, r, u, d + 1)
                                );
                            let m = n.responseText,
                                g = (n.responseJSON, n.errorType),
                                p = n.errorAdditionalInfo,
                                f = `<b>Erreur en publiant le brouillon de "${t.title.slice(0, 30)}"</b><br> ${p}`;
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinted",
                                    uiMessage: f,
                                    showUiMessage: !1,
                                    devMessage: `${s} - ${g} - '${t.title}'`,
                                    backtrace: JSON.stringify(response, ["status", "url", "data", "headers"]),
                                    body: m.substring(0, 300),
                                }),
                                { errorMessage: f, errorType: g }
                            );
                        }
                        return (
                            (responseJson = await response.json()),
                            u &&
                                c(
                                    "CoK3FVy3qF/auB2tAYx0UjvzSPnhD7FXv0LsGx3Zig3RS6k=--HiaMMXhOGnGMA+7S--ts592Oxx5tJVOt1Ca/mK/w==",
                                    `${JSON.stringify(responseJson)}`,
                                    "Azd9Cs4PB0xhFzt1XQR+dp4KqXGSRA==--N/e+s4R8rOch3AEK--xoQ5gZdqgj1+75AmEApbng==",
                                    r
                                ),
                            responseJson
                        );
                    },
                    S: async function e(t, o) {
                        const s = window.location.hostname;
                        let r;
                        o || (o = 0);
                        try {
                            r = await fetch(`https://${s}/api/v2/users/${t}?localize=false`, { headers: { accept: "application/json, text/plain, */*" }, body: null, method: "GET", mode: "cors", credentials: "include" });
                        } catch (s) {
                            if (o < 3) return await a(500), e(t, o + 1);
                            throw s;
                        }
                        if (r.status < 200 || r.status > 299) {
                            if (401 == r.status && o < 3) return await i(), e(t, o + 1);
                            if (r.status >= 500 && o < 3) return await a(600), e(t, o + 1);
                            let s,
                                n = await r.text();
                            try {
                                s = JSON.parse(n);
                            } catch (e) {}
                            let c = `Erreur en récupérant l'utilisateur n°${t}`,
                                l = "status fail",
                                u = !0,
                                d = !0;
                            return (
                                404 == r.status && ((c = `Erreur - Utilisateur n°${t} non trouvé`), (l = "not_found"), (u = !1), (d = !1)),
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinted",
                                    uiMessage: c,
                                    showUiMessage: !0,
                                    devMessage: `AC-FUD - ${l} '${t}'`,
                                    backtrace: JSON.stringify(r, ["status", "url", "headers"]),
                                    body: n.substring(0, 300),
                                    showProgressUiError: u,
                                }),
                                { errorMessage: l }
                            );
                        }
                        return (
                            (responseJSON = await r.json()),
                            null == responseJSON.user
                                ? (chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: `Erreur en récupérant l'utilisateur n°${t}`,
                                      showUiMessage: !0,
                                      devMessage: `AC-FUD - empty '${t}'`,
                                      backtrace: JSON.stringify(r, ["status", "url", "data", "headers"]),
                                      body: "",
                                      showProgressUiError: !0,
                                  }),
                                  { errorMessage: "empty" })
                                : responseJSON
                        );
                    },
                    I: async function e(t, o, s, r) {
                        const n = window.location.hostname;
                        let c;
                        r || (r = 0);
                        try {
                            c = await fetch(`https://${n}/api/v2/notifications?page=${o}&per_page=${t}&mark_as_read=${s}`, {
                                headers: { accept: "application/json, text/plain, */*" },
                                body: null,
                                method: "GET",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (n) {
                            if (r < 3) return await a(500), e(t, o, s, r + 1);
                            throw n;
                        }
                        return c.status < 200 || c.status > 299
                            ? 401 == c.status && r < 3
                                ? (await i(), e(t, o, s, r + 1))
                                : c.status >= 500 && r < 3
                                ? (await a(600), e(t, o, s, r + 1))
                                : ((responseText = await c.text()),
                                  chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: "Erreur en récupérant les notifications",
                                      showUiMessage: !0,
                                      devMessage: "AC-FN - status fail",
                                      backtrace: JSON.stringify(c, ["status", "url", "data", "headers"]),
                                      body: responseText.substring(0, 200),
                                      showProgressUiError: !0,
                                      progressFinishedButton: "close",
                                  }),
                                  { errorMessage: !0 })
                            : ((responseJSON = await c.json()), responseJSON);
                    },
                    A: async function e(t, o) {
                        const s = window.location.hostname;
                        let r,
                            n = t.link;
                        o || (o = 0);
                        try {
                            r = await fetch(`https://${s}${n}`, { headers: { accept: "application/json, text/plain, */*" }, body: null, method: "GET", credentials: "include" });
                        } catch (s) {
                            if (o < 3) return await a(500), e(t, o + 1);
                            throw s;
                        }
                        return (
                            (responseText = await r.text()),
                            404 == r.status || (500 == r.status && o >= 3)
                                ? (chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: "<b>Erreur en lisant une notification</b>",
                                      showUiMessage: !1,
                                      devMessage: "AC-FMUFWI - status fail",
                                      backtrace: JSON.stringify(r, ["status", "url", "data", "headers"]),
                                      body: `notif.body = ${t.body}`,
                                  }),
                                  { errorMessage: "skip_me" })
                                : r.status < 200 || r.status > 299
                                ? 401 == r.status && o < 3
                                    ? (await i(), e(t, o + 1))
                                    : r.status >= 500 && o < 3
                                    ? (await a(600), e(t, o + 1))
                                    : (chrome.runtime.sendMessage({
                                          message: "error",
                                          origin: "vinted",
                                          uiMessage: "<b>Erreur en lisant une notification</b>",
                                          showUiMessage: !0,
                                          devMessage: "AC-FMUFWI - status fail",
                                          backtrace: JSON.stringify(r, ["status", "url", "data", "headers"]),
                                          body: `notif.body = ${t.body}`,
                                      }),
                                      { errorMessage: !0 })
                                : r.url
                        );
                    },
                    k: async function e(t, o, s) {
                        const r = window.location.hostname,
                            c = n();
                        let l;
                        s || (s = 0);
                        try {
                            l = await fetch(`https://${r}/api/v2/users/${t}/msg_threads/${o}`, { headers: { accept: "application/json, text/plain, */*" }, body: null, method: "GET", credentials: "include", "x-csrf-token": c });
                        } catch (r) {
                            if (s < 3) return await a(500), e(t, o, s + 1);
                            throw r;
                        }
                        if (l.status < 200 || l.status > 299) {
                            if (401 == l.status && s < 3) return await i(), e(t, o, s + 1);
                            if (l.status >= 500 && s < 3) return await a(600), e(t, o, s + 1);
                            let r,
                                n = await l.text();
                            try {
                                r = JSON.parse(n);
                            } catch (e) {}
                            return 404 == l.status && r && "not_found" == r.message_code
                                ? { errorMessage: "not_found" }
                                : (chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: "Erreur en récupérant les messages",
                                      showUiMessage: !0,
                                      devMessage: "AC-FMT - status fail",
                                      backtrace: JSON.stringify(l, ["status", "url", "data", "headers"]),
                                      body: n.substring(0, 200),
                                  }),
                                  { errorMessage: !0 });
                        }
                        return (responseJSON = await l.json()), responseJSON;
                    },
                    N: async function e(t, o, s, r, l) {
                        const u = window.location.hostname,
                            d = n();
                        let m,
                            g = { body: s, photo_temp_uuids: null },
                            p = JSON.stringify(g);
                        l || (l = 0);
                        try {
                            m = await fetch(`https://${u}/api/v2/users/${t}/msg_threads/${o}`, { headers: { "content-type": "application/json", "x-csrf-token": d }, body: p, method: "PUT", credentials: "include" });
                        } catch (n) {
                            if (l < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${l} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "wkaf5bLj9bjpHhkHS+sdh1k0C6HHOSSoHXOCwEYrxU9q0RRdfpObQKg1MYzlw+kCo26M--xX10/LW+egydozLd--zT0dKHftJIlJeXDJ728B/g==",
                                        r
                                    ),
                                    e(t, o, s, r, l + 1)
                                );
                            throw n;
                        }
                        return m.status < 200 || m.status > 299
                            ? 401 == m.status && l < 3
                                ? (await i(), e(t, o, s, r, l + 1))
                                : m.status >= 500 && l < 3
                                ? (await a(600), e(t, o, s, r, l + 1))
                                : ((responseText = await m.text()),
                                  chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: "Erreur en postant un message",
                                      showUiMessage: !0,
                                      devMessage: "AC-PM - status fail",
                                      backtrace: JSON.stringify(m, ["status", "url", "data", "headers"]),
                                      body: responseText.substring(0, 200),
                                      activityUid: r,
                                  }),
                                  { errorMessage: !0 })
                            : ((responseJSON = await m.json()), responseJSON);
                    },
                    O: async function e(t, o, s, r, l) {
                        const u = window.location.hostname,
                            d = n();
                        let m,
                            g = { offer: { price: o, currency: s } },
                            p = JSON.stringify(g);
                        l || (l = 0);
                        try {
                            m = await fetch(`https://${u}/api/v2/transactions/${t}/offers`, {
                                headers: { accept: "application/json, text/plain, */*", "content-type": "application/json", "x-csrf-token": d },
                                body: p,
                                method: "POST",
                                credentials: "include",
                            });
                        } catch (n) {
                            if (l < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${l} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "i90FY2OEmK+IRLgTXcdnTUq+CIFta2zrC93/VQ3SwKtzLiEs6liqV9wEyB9G9xb5mQ==--coH/Jc9MhLJN9O5G--ovW920kFEj0yItQf6XUemw==",
                                        r
                                    ),
                                    e(t, o, s, r, l + 1)
                                );
                            throw n;
                        }
                        return m.status < 200 || m.status > 299
                            ? 401 == m.status && l < 3
                                ? (await i(), e(t, o, s, r, l + 1))
                                : m.status >= 500 && l < 3
                                ? (await a(600), e(t, o, s, r, l + 1))
                                : ((responseText = await m.text()),
                                  chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: "Erreur en postant une offre",
                                      showUiMessage: !0,
                                      devMessage: "AC-PO - status fail",
                                      backtrace: JSON.stringify(m, ["status", "url", "data", "headers"]),
                                      body: responseText.substring(0, 200),
                                      activityUid: r,
                                  }),
                                  { errorMessage: !0 })
                            : ((responseJSON = await m.json()), responseJSON);
                    },
                    L: async function (e) {
                        const t = await s(["userInfo", "prodUrl"]);
                        let o = t.userInfo,
                            r = t.prodUrl;
                        const a = {},
                            n = { Accept: "application/json", "Content-Type": "application/json", "User-email": o.email, "User-token": o.authentication_token };
                        let i;
                        try {
                            i = await fetch(`${r}/api/get_info`, { method: "POST", headers: n, body: JSON.stringify(a) });
                        } catch (t) {
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "<b>Connexion impossible avec clemz.app</b><br>Veuillez réessayer",
                                    showUiMessage: e,
                                    devMessage: "AC-GUI - code",
                                    backtrace: JSON.stringify(t, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !1,
                                }),
                                "fail"
                            );
                        }
                        let c = await u(i);
                        return "success" == c && e && (await chrome.storage.local.set({ globalUiMessage: { content: "Informations mises à jour", type: "success", time: 2e3 } })), c;
                    },
                    C: async function () {
                        const e = await s(["userInfo", "prodUrl", "mainList"]),
                            t = await chrome.runtime.getManifest();
                        let o = e.userInfo,
                            r = e.prodUrl,
                            a = e.mainList;
                        const n = {},
                            i = { Accept: "application/json", "Content-Type": "application/json", "User-email": o.email, "User-token": o.authentication_token, "Extension-version": t.version };
                        if (!o.profileUrl) {
                            if (null == a[0] || !a[0]?.full_data?.user?.path)
                                return chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez mettre un article de votre dressing dans la liste à traiter", type: "danger" } }), "fail";
                            if (null == document.querySelector("#user-menu-button")) return chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous connecter à votre compte Vinted", type: "danger" } }), "fail";
                            let e = a[0]?.full_data?.user?.path.split("/"),
                                t = e[e.length - 1];
                            i["Temptative-profile-Url"] = t;
                            let o = document.querySelector("#user-menu-button img").alt.split(/[^a-zA-Z0-9]+/)[0];
                            if ("" == t.trim()) return chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous connecter à votre compte Vinted", type: "danger" } }), "fail";
                            if (!t.includes(o)) return chrome.storage.local.set({ globalUiMessage: { content: "Erreur - l'article que vous essayez de republier ne vous appartient pas", type: "danger" } }), "fail";
                        }
                        let c;
                        try {
                            c = await fetch(`${r}/api/check`, { method: "POST", headers: i, body: JSON.stringify(n) });
                        } catch (e) {
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "<b>Connexion impossible avec clemz.app</b><br>Veuillez réessayer",
                                    showUiMessage: !0,
                                    devMessage: "AC-CUR - code",
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !1,
                                }),
                                "fail"
                            );
                        }
                        return await u(c);
                    },
                    R: async function (e, t, o, r, a) {
                        const n = await s(["userInfo", "prodUrl"]),
                            i = await chrome.runtime.getManifest(),
                            c = n.prodUrl,
                            l = n.userInfo.authentication_token,
                            u = n.userInfo.email,
                            d = `${window.innerWidth} x ${window.innerHeight}`,
                            m = r || {},
                            g = { activity: { process_type: t, total_steps: e, details: JSON.stringify(m), options: o, screen_size: d, parent_activity_uid: a } },
                            p = await fetch(`${c}/api/activities`, {
                                method: "POST",
                                headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": u, "User-token": l, "Extension-version": i.version, "User-agent-infos": navigator.userAgent },
                                body: JSON.stringify(g),
                            });
                        if (p.status < 200 || p.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur ACCA)",
                                    devMessage: "AC-CA - status fail",
                                    backtrace: JSON.stringify(p, ["status", "url", "data", "headers"]),
                                    showUiMessage: !0,
                                    showProgressUiError: !0,
                                }),
                                { message: "fail" }
                            );
                        const f = await p.json();
                        if ("forbidden" == f.is_success) return chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), { message: "fail" };
                        if ("success" != f.is_success) {
                            let e = (await s(["progressUiMessage"])).progressUiMessage;
                            return (
                                chrome.storage.local.set({
                                    globalUiMessage: { content: f.data.message_content, type: f.data.message_type },
                                    progressUiMessage: {
                                        currentIndex: e.currentIndex,
                                        totalIndex: e.totalIndex,
                                        stage: "Action non autorisée",
                                        articleName: "XX Process arrêté XX",
                                        articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                        showLoader: !1,
                                        processFinishedButton: "close",
                                    },
                                }),
                                { message: "fail" }
                            );
                        }
                        return (activityUid = f.data.uid), "send_message" != t && (await chrome.storage.local.set({ activityUid: activityUid })), { message: "success", activityUid: activityUid };
                    },
                    T: async function (e, t, o, r) {
                        let a = await s(["userInfo", "activityUid", "prodUrl"]);
                        const n = await chrome.runtime.getManifest();
                        let i = a.userInfo,
                            c = a.activityUid;
                        const l = o || {};
                        t && (c = t);
                        const u = a.prodUrl,
                            d = i.authentication_token,
                            m = i.email,
                            g = { activity: { process_type: e, details: JSON.stringify(l), auto_message_stage: r } },
                            p = await fetch(`${u}/api/activities/${c}`, {
                                method: "PUT",
                                headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": m, "User-token": d, "Extension-version": n.version },
                                body: JSON.stringify(g),
                            });
                        if (p.status < 200 || p.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "<b>Erreur de com avec clemz.app</b>",
                                    showUiMessage: !0,
                                    devMessage: "AC-UAc - status fail",
                                    backtrace: JSON.stringify(p, ["status", "url", "data", "headers"]),
                                    showProgressUiError: !0,
                                }),
                                "fail"
                            );
                        const f = await p.json();
                        if ("forbidden" == f.is_success) return chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail";
                        if ("success" != f.is_success)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: f.data.message_content,
                                    showUiMessage: !0,
                                    devMessage: "AC-UA - app refusal",
                                    backtrace: JSON.stringify(p, ["status", "url", "data", "headers"]),
                                    showProgressUiError: !0,
                                }),
                                "fail"
                            );
                        if (((i.repostLeft = f.data.repost_left), (i.autoMessageLeft = f.data.auto_message_left), await chrome.storage.local.set({ userInfo: i }), i.repostLeft < 0)) {
                            a = await s(["progressUiMessage"]);
                            let e = a.progressUiMessage;
                            return (
                                chrome.storage.local.set({
                                    upgradeSubscriptionModalData: `<p class="text-center">⚠️Tes <span class="text-danger font-weight-bolder">${i.maxRepostLeft} republications</span><br>mensuelles sont épuisées.</p>`,
                                    progressUiMessage: {
                                        currentIndex: e.currentIndex + 1,
                                        totalIndex: e.totalIndex,
                                        stage: "Pas assez de republications",
                                        articleName: "XX Process arrêté XX",
                                        articleImageUrl: e.articleImageUrl,
                                        showLoader: !1,
                                        processFinishedButton: "refresh",
                                    },
                                }),
                                "fail"
                            );
                        }
                        if (null != i.autoMessageIncluded && i.autoMessageLeft < 0) {
                            a = await s(["progressUiMessage"]);
                            let e = a.progressUiMessage;
                            return (
                                chrome.storage.local.set({
                                    upgradeSubscriptionModalData: `<p class="text-center">⚠️Messages aux favs : <span class="text-danger font-weight-bolder">${i.autoMessageIncluded} max / jour</span><br><br>Tu pourras envoyer de nouveaux messages demain (après minuit)</p>`,
                                    progressUiMessage: {
                                        currentIndex: e.currentIndex + 1,
                                        totalIndex: e.totalIndex,
                                        stage: "Pas assez de republications",
                                        articleName: "XX Process arrêté XX",
                                        articleImageUrl: e.articleImageUrl,
                                        showLoader: !1,
                                        processFinishedButton: "refresh",
                                    },
                                }),
                                "fail"
                            );
                        }
                        return "success";
                    },
                    J: async function (e, t, o) {
                        const r = await s(["userInfo", "prodUrl"]),
                            a = r.prodUrl,
                            n = r.userInfo.authentication_token,
                            i = r.userInfo.email,
                            c = { auto_message: { auto_message_first: e, auto_message_second: t, auto_message_excluded_vinties: o.sort().join(";") } },
                            l = await fetch(`${a}/api/auto_messages/125`, { method: "PUT", headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": i, "User-token": n }, body: JSON.stringify(c) });
                        if (l.status < 200 || l.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur AC-UAMP)",
                                    devMessage: "AC-UAMP - status fail",
                                    backtrace: JSON.stringify(l, ["status", "url", "data", "headers"]),
                                    showUiMessage: !0,
                                }),
                                "fail"
                            );
                        const u = await l.json();
                        return "forbidden" == u.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail")
                            : "success" != u.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: u.data.message_content, type: u.data.message_type } }), "fail")
                            : (await d(u), "success");
                    },
                    _: async function (e, t) {
                        const o = await s(["userInfo", "prodUrl"]),
                            r = o.prodUrl,
                            a = o.userInfo.authentication_token,
                            n = o.userInfo.email,
                            i = { clipboard: { title: e, content: t } },
                            c = await fetch(`${r}/api/clipboards`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": n, "User-token": a }, body: JSON.stringify(i) });
                        if (c.status < 200 || c.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur ACCC)",
                                    devMessage: "AC-CC - status fail",
                                    backtrace: JSON.stringify(c, ["status", "url", "data", "headers"]),
                                    showUiMessage: !0,
                                }),
                                "fail"
                            );
                        const l = await c.json();
                        return "forbidden" == l.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail")
                            : "success" != l.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: l.data.message_content, type: l.data.message_type } }), "fail")
                            : (await chrome.storage.local.set({ clipboardIndex: l.data.clipboards, clipboardUpdatedAt: Date.now() }), "success");
                    },
                    $: async function () {
                        const e = await s(["userInfo", "prodUrl"]),
                            t = e.prodUrl,
                            o = e.userInfo.authentication_token,
                            r = e.userInfo.email,
                            a = await fetch(`${t}/api/clipboards`, { method: "GET", headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": r, "User-token": o } });
                        if (a.status < 200 || a.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur ACFAC)",
                                    devMessage: "AC-FAC - status fail",
                                    backtrace: JSON.stringify(a, ["status", "url", "data", "headers"]),
                                    showUiMessage: !0,
                                }),
                                "fail"
                            );
                        const n = await a.json();
                        return "forbidden" == n.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail")
                            : "success" != n.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: n.data.message_content, type: n.data.message_type } }), "fail")
                            : (await chrome.storage.local.set({ clipboardIndex: n.data.clipboards, clipboardUpdatedAt: Date.now() }), "success");
                    },
                    F: async function (e) {
                        const t = await s(["userInfo", "prodUrl"]),
                            o = t.prodUrl,
                            r = t.userInfo.authentication_token,
                            a = t.userInfo.email,
                            n = await fetch(`${o}/api/clipboards/${e}`, { method: "DELETE", headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": a, "User-token": r } });
                        if (n.status < 200 || n.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur ACDC)",
                                    devMessage: "AC-DC - status fail",
                                    backtrace: JSON.stringify(n, ["status", "url", "data", "headers"]),
                                    showUiMessage: !0,
                                }),
                                "fail"
                            );
                        const i = await n.json();
                        return "forbidden" == i.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail")
                            : "success" != i.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: i.data.message_content, type: i.data.message_type } }), "fail")
                            : (await chrome.storage.local.set({ clipboardIndex: i.data.clipboards, clipboardUpdatedAt: Date.now() }), "success");
                    },
                    V: async function (e, t, o) {
                        const r = await s(["userInfo", "prodUrl"]),
                            a = r.prodUrl,
                            n = r.userInfo.authentication_token,
                            i = r.userInfo.email,
                            c = { clipboard: { title: t, content: o } },
                            l = await fetch(`${a}/api/clipboards/${e}`, { method: "PUT", headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": i, "User-token": n }, body: JSON.stringify(c) });
                        if (l.status < 200 || l.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur ACUC)",
                                    devMessage: "AC-UC - status fail",
                                    backtrace: JSON.stringify(l, ["status", "url", "data", "headers"]),
                                }),
                                "fail"
                            );
                        const u = await l.json();
                        return "forbidden" == u.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail")
                            : "success" != u.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: u.data.message_content, type: u.data.message_type } }), "fail")
                            : (await chrome.storage.local.set({ clipboardIndex: u.data.clipboards, clipboardUpdatedAt: Date.now() }), "success");
                    },
                    P: async function (e, t) {
                        const o = await s(["userInfo", "prodUrl"]),
                            r = o.prodUrl,
                            a = o.userInfo.authentication_token,
                            n = o.userInfo.email,
                            i = { clipboard: { new_order: t - 1 } },
                            c = await fetch(`${r}/api/clipboards/${e}/update_order`, {
                                method: "POST",
                                headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": n, "User-token": a },
                                body: JSON.stringify(i),
                            });
                        if (c.status < 200 || c.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur ACUOC)",
                                    devMessage: "AC-UOC - status fail",
                                    backtrace: JSON.stringify(c, ["status", "url", "data", "headers"]),
                                    showUiMessage: !0,
                                }),
                                "fail"
                            );
                        const l = await c.json();
                        return "forbidden" == l.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail")
                            : "success" != l.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: l.data.message_content, type: l.data.message_type } }), "fail")
                            : (await chrome.storage.local.set({ clipboardIndex: l.data.clipboards, clipboardUpdatedAt: Date.now() }),
                              chrome.storage.local.set({ globalUiMessage: { content: "Le texte a bien été déplacé.", type: "success", time: 2e3 } }),
                              "success");
                    },
                    j: c,
                    D: async function () {
                        const e = await s(["userInfo", "prodUrl"]),
                            t = await chrome.runtime.getManifest(),
                            o = e.prodUrl,
                            r = e.userInfo.authentication_token,
                            a = e.userInfo.email,
                            n = { request_favs: { screen_size: `${window.innerWidth} x ${window.innerHeight}` } },
                            i = await fetch(`${o}/api/request_favs`, {
                                method: "POST",
                                headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": a, "User-token": r, "Extension-version": t.version, "User-agent-infos": navigator.userAgent },
                                body: JSON.stringify(n),
                            });
                        if (i.status < 200 || i.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "Erreur de com avec clemz.app (erreur ACCRF)",
                                    devMessage: "AC-CRF - status fail",
                                    backtrace: JSON.stringify(i, ["status", "url", "data", "headers"]),
                                    showUiMessage: !0,
                                    showProgressUiError: !0,
                                }),
                                { message: "fail" }
                            );
                        const c = await i.json();
                        return "forbidden" == c.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), { message: "fail" })
                            : "success" != c.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: c.data.message_content, type: c.data.message_type } }), { message: "fail" })
                            : { message: "success", data: c.data };
                    },
                    X: async function (e, t) {
                        let o = await s(["userInfo", "activityUid", "prodUrl"]);
                        const r = await chrome.runtime.getManifest();
                        let a = o.userInfo;
                        const n = o.prodUrl,
                            i = a.authentication_token,
                            c = a.email,
                            l = { request_favs: { options: t } },
                            u = await fetch(`${n}/api/request_favs/${e}`, {
                                method: "PUT",
                                headers: { Accept: "application/json", "Content-Type": "application/json", "User-email": c, "User-token": i, "Extension-version": r.version },
                                body: JSON.stringify(l),
                            });
                        if (u.status < 200 || u.status > 299)
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinz",
                                    uiMessage: "<b>Erreur de com avec clemz.app</b>",
                                    showUiMessage: !0,
                                    devMessage: "AC-URF - status fail",
                                    backtrace: JSON.stringify(u, ["status", "url", "data", "headers"]),
                                    showProgressUiError: !0,
                                }),
                                "fail"
                            );
                        const d = await u.json();
                        return "forbidden" == d.is_success
                            ? (chrome.storage.local.set({ globalUiMessage: { content: "Erreur - veuillez vous reconnecter", type: "danger" }, loginStatus: !1 }), "fail")
                            : "success" != d.is_success
                            ? (chrome.runtime.sendMessage({
                                  message: "error",
                                  origin: "vinz",
                                  uiMessage: d.data.message_content,
                                  showUiMessage: !0,
                                  devMessage: "AC-URF - app refusal",
                                  backtrace: JSON.stringify(u, ["status", "url", "data", "headers"]),
                                  showProgressUiError: !0,
                              }),
                              "fail")
                            : "success";
                    },
                    B: async function e(t, o, s, r, n) {
                        s || (s = "AC-FPVP");
                        let i = [],
                            l = JSON.parse(JSON.stringify(o)),
                            u = t.length,
                            d = 0;
                        for (photoUrl of (n || (n = 0), t)) {
                            let m;
                            d++, (l.stage = `${o.stage} (${Math.round((d / u) * 50)}%)`), chrome.storage.local.set({ progressUiMessage: l }), (proxiedURL = "https://vinz-cors.herokuapp.com/" + photoUrl);
                            try {
                                m = await fetch(proxiedURL);
                            } catch (i) {
                                if (n < 3)
                                    return (
                                        await a(500),
                                        c(
                                            "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                            `${n} ---- ${JSON.stringify(i, Object.getOwnPropertyNames(i))}`,
                                            "O8uQSGm6hXVZ/aOyjyCkp2W+tUhvolW4tFlmvNaUcr8yV3BNnHfrWL1Uc1BOg4gEpdyWyBDYaWKu8Vs=--47f8UP6Kjkl08/3L--NMOafkUQBpbfZPcv3h9QqQ==",
                                            r
                                        ),
                                        e(t, o, s, r, n + 1)
                                    );
                                throw i;
                            }
                            if (m.status < 200 || m.status > 299)
                                return m.status >= 500 && n < 3
                                    ? (await a(600),
                                      c(
                                          "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                          `${n} - ${JSON.stringify(m, ["status", "url", "data", "headers"])}`,
                                          "0EiOXOHknKq60ahIOqR21SAe+tUg7QXljHtgQImJrinHzQxpCT/GHP6ZTRzlvJTIINL0PbFXQ2L65hsVwHWSz20aPw==--H5rW3X3oJWoLTWuR--zR+9u0ROsUsjIqhZMjOPLA==",
                                          r
                                      ),
                                      e(t, o, s, r, n + 1))
                                    : ((responseText = await m.text()),
                                      chrome.runtime.sendMessage({
                                          message: "error",
                                          origin: "cors",
                                          uiMessage: "",
                                          devMessage: `${s} - status fail`,
                                          backtrace: JSON.stringify(m, ["status", "url", "data", "headers"]),
                                          body: responseText.substring(0, 300),
                                          showProgressUiError: !1,
                                      }),
                                      { errorMessage: !0, response: JSON.stringify(m, ["status", "url", "data", "headers"]) });
                            (photoBlob = await m.blob()), i.push(photoBlob);
                        }
                        return i;
                    },
                    q: async function e(t, o, s) {
                        const r = window.location.hostname,
                            u = n();
                        s || (s = 0);
                        let d,
                            m = { type: "item", user_favourites: t.map((e) => e.id) },
                            g = JSON.stringify(m);
                        try {
                            d = await fetch(`https://${r}/api/v2/user_favourites/toggle`, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "none",
                                    "x-csrf-token": u,
                                },
                                body: g,
                                method: "POST",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (r) {
                            if (s < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${s} ---- ${JSON.stringify(r, Object.getOwnPropertyNames(r))}`,
                                        "KMuKQ5ofujRgWI4mO1I2Xg47+G8mIrY2T+m+JBuwCU+EhEKraBy/tPkgSS7/BK9GA/K0DG3vHg==--LHWkj0acmUquw5s0--lrfRSKvNC7pe48LxSBf4+w==",
                                        o
                                    ),
                                    e(t, o, s + 1)
                                );
                            throw r;
                        }
                        if (d.status < 200 || d.status > 299) {
                            let r = await l(d),
                                a = "<b>Erreur sur les favoris</b>";
                            if ("token_expired" == r.errorType && s < 3)
                                return (
                                    await i(),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${s} ---- ${JSON.stringify(r, Object.getOwnPropertyNames(r))} ---- ${JSON.stringify(d, ["status", "url", "data", "headers"])}`,
                                        "Z4mY/m8y5dw9hnR9KBO1QW9+zDlDCCE+By1421T6LaB06CASwJ5tlc1JtDnk/o73g9pHApujrA3UF3tRn3mrOCI9QU2Ae9A4989NknEUfDY=--FRD2vMPl0BRrVIbY--o6Ah8HIN1PB/KiNHlyylVg==",
                                        o
                                    ),
                                    e(t, o, s + 1)
                                );
                            let n = r.responseText,
                                u = (r.responseJSON, r.errorType),
                                m = r.errorAdditionalInfo;
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinted",
                                    uiMessage: a,
                                    showUiMessage: !0,
                                    showProgressUiError: !0,
                                    devMessage: `AC-TF - ${u} - '${t.map((e) => e.title).join("//")}'`,
                                    backtrace: JSON.stringify(d, ["status", "url", "data", "headers"]),
                                    body: n.substring(0, 300),
                                }),
                                { errorMessage: a, errorType: u, errorAdditionalInfo: m, response: JSON.stringify(d, ["status", "url", "data", "headers"]) }
                            );
                        }
                        return (responseJson = await d.json()), responseJson.message_code;
                    },
                    Z: async function e(t, o, s, r, u) {
                        const d = window.location.hostname,
                            m = n();
                        u || (u = 0);
                        try {
                            response = await fetch(`https://${d}/api/v2/users/${t}/items/favourites?page=${s}&include_sold=true&per_page=${o}\n`, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "none",
                                    "x-csrf-token": m,
                                },
                                method: "GET",
                                mode: "cors",
                                credentials: "include",
                            });
                        } catch (n) {
                            if (u < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${u} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "Uy6NWTviy8fBGChxwOHpg4tBr99CiEDcxlIdL6vaenMKLrtsUADfpDTBKlvlETvpziL6ZKf1LBMBrgw=--okuxO8wN6+L8uWdZ--eOxrG6bl0nZBRSGz2czFSA==",
                                        r
                                    ),
                                    e(t, o, s, r, u + 1)
                                );
                            throw n;
                        }
                        if (response.status < 200 || response.status > 299) {
                            let n = await l(response),
                                d = "<b>Erreur en récupérant vos favoris</b>";
                            if ("token_expired" == n.errorType && u < 3)
                                return (
                                    await i(),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${u} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ---- ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "3SERkoncorSrq055VLj3ZND7nWLq9J2xd/T/ZgcwhdgEXfSoetJDYKnXyjn9FgiI0zujSpkpgWvJouJQvf/ljw6VHv7DzJsmLwQsxbUOkfIL30zL--bRxtO0z4rFCteKsE--bzszMB3WaQOsJRwrYwTdHQ==",
                                        r
                                    ),
                                    e(t, o, s, r, u + 1)
                                );
                            if (response.status >= 400 && u < 3)
                                return (
                                    await a(600),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${u}  ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))} ----  ${JSON.stringify(response, ["status", "url", "data", "headers"])}`,
                                        "3SERkoncorSrq055VLj3ZND7nWLq9J2xd/T/ZgcwhdgEXfSoetJDYKnXyjn9FgiI0zujSpkpgWvJouJQvf/ljw6VHv7DzJsmLwQsxbUOkfIL30zL--bRxtO0z4rFCteKsE--bzszMB3WaQOsJRwrYwTdHQ==",
                                        r
                                    ),
                                    e(t, o, s, r, u + 1)
                                );
                            let m = n.responseText,
                                g = (n.responseJSON, n.errorType),
                                p = n.errorAdditionalInfo;
                            return (
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "vinted",
                                    uiMessage: d,
                                    showUiMessage: !0,
                                    showProgressUiError: !0,
                                    devMessage: `AC-FUF - ${g}'`,
                                    backtrace: JSON.stringify(response, ["status", "url", "data", "headers"]),
                                    body: m.substring(0, 300),
                                }),
                                { errorMessage: d, errorType: g, errorAdditionalInfo: p, response: JSON.stringify(response, ["status", "url", "data", "headers"]) }
                            );
                        }
                        return (responseJson = await response.json()), responseJson;
                    },
                    H: async function e(t, o, s, r) {
                        const l = window.location.hostname,
                            u = n();
                        r || (r = 0);
                        let d = { user: { user_settings: { allow_my_favourite_notifications: o } } },
                            m = JSON.stringify(d);
                        try {
                            (fetchDetails = {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "cache-control": "no-cache",
                                    "content-type": "application/json",
                                    pragma: "no-cache",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "none",
                                    "x-csrf-token": u,
                                },
                                method: t,
                                mode: "cors",
                                credentials: "include",
                            }),
                                "PUT" == t && (fetchDetails.body = m),
                                (response = await fetch(`https://${l}/api/v2/users/current`, fetchDetails));
                        } catch (n) {
                            if (r < 3)
                                return (
                                    await a(500),
                                    c(
                                        "ZL+LzCUe565+2EILEBJgIt74XJp5gJSH8qcHHfm1a7OLq2DmUfNd7X/u--x6zuVoZgXRtoJzpi--jn2QYWXKbv3Y2AxsublVzA==",
                                        `${r} ---- ${JSON.stringify(n, Object.getOwnPropertyNames(n))}`,
                                        "C7sQdqoR8f5zjs7Al3R0ak1EpYXIY5ScJ6RPaiXI4UHCq5lM07QGoc//UwsgBzYL2BVFqe4NgKR4syyBW0an4T7U7f/FrlFWLRU=--wNnHaRCsHcIKSL2/--vifI+x9m0Mx4Ya2dQHeFVw==",
                                        s
                                    ),
                                    e(t, o, s, r + 1)
                                );
                            throw n;
                        }
                        return response.status < 200 || response.status > 299
                            ? 401 == response.status && r < 3
                                ? (await i(), e(t, o, s, r + 1))
                                : response.status >= 500 && r < 3
                                ? (await a(600), e(t, o, s, r + 1))
                                : ((responseText = await response.text()),
                                  chrome.runtime.sendMessage({
                                      message: "error",
                                      origin: "vinted",
                                      uiMessage: "Erreur en accédant à vos paramètres",
                                      showUiMessage: !0,
                                      devMessage: "AC-SNTF - status fail",
                                      backtrace: JSON.stringify(response, ["status", "url", "data", "headers"]),
                                      body: responseText.substring(0, 200),
                                      activityUid: s,
                                  }),
                                  { errorMessage: !0 })
                            : ((responseJSON = await response.json()), responseJSON);
                    },
                };
            },
            { "./utilities.js": 12 },
        ],
        2: [
            function (e, t, o) {
                const { t: s, G: r, W: a, i: n, Y: i, K: c, ee: l, te: u, oe: d } = e("./utilities.js"),
                    { C: m, I: g, J: p, S: f, A: h, k: b, N: w, O: M, R: v, T: y } = e("./apiCalls.js");
                async function U() {
                    if ("success" != (await m()))
                        return (
                            chrome.storage.local.set({
                                progressUiMessage: {
                                    currentIndex: 0,
                                    totalIndex: 0,
                                    stage: "XXXX ERREUR XXXX",
                                    articleName: "Process stoppé",
                                    articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                    showLoader: !1,
                                    processFinishedButton: "close",
                                },
                                autoMessageON: !1,
                            }),
                            "fail"
                        );
                    let e,
                        t = await s([
                            "userInfo",
                            "autoMessageProcessedNotif",
                            "ignorePastNotifications",
                            "makeOffer",
                            "makeOfferValue",
                            "makeOfferType",
                            "checkUserFeedback",
                            "maxDaysInPastSwitch",
                            "maxDaysInPastValue",
                            "checkUserFeedbackValue",
                            "autoMessageParams",
                        ]),
                        o = t.autoMessageProcessedNotif,
                        r = t.maxDaysInPastSwitch,
                        a = t.maxDaysInPastValue,
                        n = t.makeOffer,
                        i = t.makeOfferValue,
                        c = t.makeOfferType,
                        l = t.checkUserFeedback,
                        u = t.checkUserFeedbackValue,
                        d = t.autoMessageParams,
                        p = t.userInfo,
                        f = !t.ignorePastNotifications;
                    window.location.href.includes("autoMessage") ? ((e = !1), (f = !0)) : (e = !0);
                    let h,
                        b = "Phase2 : Nouvelles notifs";
                    if (
                        (e && (b = "Phase1: lecture de l'historique"),
                        chrome.storage.local.set({
                            progressUiMessage: { currentIndex: 0, totalIndex: 3, stage: "Lecture des notifs", articleName: b, articleImageUrl: chrome.runtime.getURL("images/bot_search.png"), processFinishedButton: `${e}`, showLoader: e },
                        }),
                        e)
                    ) {
                        let e = `ignorePastNotifications=${t.ignorePastNotifications} - maxDaysInPastSwitch=${r} - maxDaysInPastValue=${a} - makeOffer=${n} - makeOfferValue=${i}${c} - checkUserFeedback=${l} - checkUserFeedbackValue=${u}`;
                        if ("success" != (await v(1, "auto_message_cycle", e, (detailsJson = ""))).message) return "fail";
                    } else {
                        if ("success" != (await y("auto_message_cycle", null, null, "new_cycle_start"))) return "fail";
                    }
                    try {
                        h = await (async function (e, t, o, s) {
                            let r,
                                a = 1,
                                n = 0,
                                i = [],
                                c = 0,
                                l = !0;
                            for (; l; ) {
                                n += 1;
                                try {
                                    r = await g((per_page = 100), n, (markAsRead = !1), (functionCallNumber = 0));
                                } catch (e) {
                                    return (
                                        chrome.runtime.sendMessage({
                                            message: "error",
                                            origin: "code",
                                            uiMessage: "<b>Perte de connexion avec Vinted</b> en récupérant vos notifications",
                                            showUiMessage: !1,
                                            devMessage: "error AMS-FN - code",
                                            backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                            showProgressUiError: !1,
                                        }),
                                        { errorMessage: !0 }
                                    );
                                }
                                if (null != r.errorMessage) return r;
                                if ((1 == a && (a = r.pagination.total_pages), 0 == c && (c = r.pagination.total_entries), (i = i.concat(r.notifications)), (n >= a || i.length >= c) && (l = !1), !t && n > 2 && (l = !1), o)) {
                                    new Date(i.slice(-1)[0].updated_at) < new Date() - 864e5 * parseInt(s) && (l = !1);
                                }
                                chrome.storage.local.set({
                                    progressUiMessage: {
                                        currentIndex: 0,
                                        totalIndex: 3,
                                        stage: `Récupération des notifs ${i.length} / ${c}`,
                                        articleName: e,
                                        articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                        processFinishedButton: `${t}`,
                                        showLoader: t,
                                    },
                                });
                            }
                            return i;
                        })(b, e, r, a);
                    } catch (e) {
                        chrome.runtime.sendMessage({
                            message: "error",
                            origin: "code",
                            uiMessage: "<b>Erreur de Clemz</b><br>Réessaye ou contacte moi à clement@clemz.app",
                            showUiMessage: !0,
                            devMessage: "AMS-FANP - code",
                            backtrace: JSON.stringify(e, Object.getOwnPropertyNames(e)),
                            showProgressUiError: !0,
                        });
                    }
                    if (null != h.errorMessage) return "fail";
                    (notificationArray = h),
                        (notificationArray = notificationArray.filter((e) => e.link.includes("want_it"))),
                        (notificationArray = notificationArray.filter((e) => !o.includes(e.id))),
                        (notificationArray = notificationArray.filter((e) => {
                            let t = e.body.split("</a>")[0].split(">").slice(-1)[0];
                            return !d.excludedVinties.includes(t);
                        })),
                        r &&
                            (notificationArray = notificationArray.filter((e) => {
                                let t = new Date() - 864e5 * parseInt(a);
                                return new Date(e.updated_at) > t;
                            }));
                    let w = 0,
                        M = [];
                    for (let t of notificationArray) {
                        if (!e) {
                            if (1 != (await s(["autoMessageON"])).autoMessageON) return "fail";
                        }
                        let o;
                        chrome.storage.local.set({
                            progressUiMessage: {
                                currentIndex: 1,
                                totalIndex: 3,
                                stage: `Lecture des favs <b>n°${w + 1}/${notificationArray.length}</b>`,
                                articleName: b,
                                articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                showLoader: e,
                                processFinishedButton: `${e}`,
                            },
                        });
                        try {
                            o = await S(t);
                        } catch (e) {
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "<b>Erreur de Clemz</b><br>Réessaye ou contacte moi à clement@clemz.app",
                                showUiMessage: !0,
                                devMessage: "AMS-RN - code",
                                backtrace: JSON.stringify(e, Object.getOwnPropertyNames(e)),
                                showProgressUiError: !1,
                            }),
                                (o = "ignore");
                        }
                        if ((w++, "skip" != o))
                            if ("ignore" != o) {
                                if ("fail" == o)
                                    return (
                                        chrome.storage.local.set({
                                            progressUiMessage: {
                                                currentIndex: 1,
                                                totalIndex: 3,
                                                stage: "XXXX ERREUR XXXX",
                                                articleName: b,
                                                articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                showLoader: !1,
                                                processFinishedButton: "refresh",
                                            },
                                        }),
                                        "fail"
                                    );
                                M.push(t);
                            } else {
                                let e = (await s(["autoMessageProcessedNotif"])).autoMessageProcessedNotif;
                                e.push(t.id), chrome.storage.local.set({ autoMessageProcessedNotif: e });
                            }
                    }
                    w = 0;
                    let U = 0,
                        I = 0;
                    for (let t of M) {
                        if (!e) {
                            if (1 != (await s(["autoMessageON"])).autoMessageON) return "fail";
                        }
                        if (
                            (chrome.storage.local.set({
                                progressUiMessage: {
                                    currentIndex: 2,
                                    totalIndex: 3,
                                    stage: `Envoi des messages : <b>${Math.round(((w + 1) / M.length) * 100)}%</b>`,
                                    articleName: b,
                                    articleImageUrl: chrome.runtime.getURL("images/bot_screen.png"),
                                    showLoader: e,
                                    processFinishedButton: `${e}`,
                                },
                            }),
                            f)
                        ) {
                            let e;
                            try {
                                e = await x(t, n, i, c, l, u);
                            } catch (t) {
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "<b>Erreur de Clemz</b><br>Réessaye ou contacte moi à clement@clemz.app",
                                    showUiMessage: !0,
                                    devMessage: "AMS-SMTN - code",
                                    backtrace: JSON.stringify(t, Object.getOwnPropertyNames(t)),
                                    showProgressUiError: !0,
                                }),
                                    (e = "skip");
                            }
                            if ((w++, "skip" == e)) continue;
                            if ("fail" == e) return "fail";
                            "message_sent" == e ? U++ : "max_reached" == e && I++;
                        }
                        let o = (await s(["autoMessageProcessedNotif"])).autoMessageProcessedNotif;
                        o.push(t.id), chrome.storage.local.set({ autoMessageProcessedNotif: o });
                    }
                    return "success" != (await y("auto_message_cycle", null, null, "cycle_end"))
                        ? "fail"
                        : (U > 0
                              ? chrome.storage.local.set({ globalUiMessage: { content: `<b>${U} Messages envoyés avec succès !</b><br>Retrouves les dans ta messagerie Vinted.`, type: "success" } })
                              : e && !f
                              ? chrome.storage.local.set({ globalUiMessage: { content: "<b>Vous avez choisi de ne réagir qu'aux favoris reçus en direct.</b><br>=> aucun message envoyé pour le moment.", type: "info", time: "10000" } })
                              : chrome.storage.local.set({ globalUiMessage: { content: "<b>Aucun message envoyé.</b><br>La lecture de tes notifs n'a rien donné.", type: "info" } }),
                          I > 0
                              ? (chrome.storage.local.set({
                                    upgradeSubscriptionModalData: `<p class="text-center">⚠️Messages aux favs : <span class="text-danger font-weight-bolder">${p.autoMessageIncluded}&nbsp;max&nbsp;/&nbsp;jour</span><br><br>(A noter: Clemz a trouvé <span class="font-weight-bolder">${I}&nbsp;autres&nbsp;favori(s)</span><br>pouvant donner lieu à un message)</p>`,
                                }),
                                "max_reached")
                              : void 0);
                }
                async function S(e) {
                    let t,
                        o = await s(["autoMessageSent24hCount", "autoMessageProcessedNotif", "autoMessageLastContactWithUser", "userInfo"]),
                        r = o.autoMessageSent24hCount,
                        a = (o.autoMessageProcessedNotif, o.autoMessageLastContactWithUser),
                        i = o.userInfo.profileUrl,
                        c = /[0-9]{3,}/g,
                        l = e.body.split("</a>")[0].match(c)[0];
                    try {
                        t = await h(e, (functionCallNumber = 0));
                    } catch (e) {
                        return (
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "Erreur de Clemz en récupérant vos messages (erreur AMS-FTUFWI)",
                                showUiMessage: !1,
                                devMessage: "AMS-FTUFWI1 - code",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !1,
                            }),
                            "fail"
                        );
                    }
                    if ("skip_me" == t.errorMessage) return "skip";
                    if (null != t.errorMessage) return "fail";
                    if (!t.includes("/inbox/")) return "ignore";
                    let u,
                        d = t.match(c)[0],
                        m = i.match(c)[0];
                    for (let e = 0; e < 3; e++) {
                        try {
                            u = await b(m, d, (functionCallNumber = 0));
                        } catch (e) {
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "Erreur de Clemz en récupérant vos messages (erreur AMS-FMT)",
                                showUiMessage: !1,
                                devMessage: "error AMS-FMT-1 - code",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !1,
                            }),
                                (u = { errorMessage: !0 });
                        }
                        if ("not_found" != u.errorMessage) break;
                        await n(500);
                    }
                    if (null != u.errorMessage) return "fail";
                    let g = u.msg_thread;
                    for (let e of g.messages)
                        if (
                            e.entity.user_id == parseInt(m) &&
                            ((null == a[`userId_${l}`] || a[`userId_${l}`] < new Date(e.created_at_ts).getTime()) && (a[`userId_${l}`] = new Date(e.created_at_ts).getTime()), new Date() - 864e5 < new Date(e.created_at_ts).getTime())
                        ) {
                            r[`userId_${l}`] = r[`userId_${l}`] + 1 || 1;
                            break;
                        }
                    await chrome.storage.local.set({ autoMessageSent24hCount: r, autoMessageLastContactWithUser: a });
                }
                async function x(e, t, o, r, a, n) {
                    let i = await s(["autoMessageSent24hCount", "autoMessageLastContactWithUser", "autoMessageParams", "userInfo", "activityUid"]),
                        c = i.autoMessageSent24hCount,
                        l = i.autoMessageLastContactWithUser,
                        u = i.autoMessageParams,
                        d = i.userInfo.autoMessageIncluded,
                        m = i.userInfo.autoMessageLeft,
                        g = i.userInfo.profileUrl,
                        p = /[0-9]{3,}/g;
                    if (e.body.split("</a>").length < 3) return "ignore";
                    let U,
                        S = e.body.split("</a>")[0].match(p)[0];
                    if (c[`userId_${S}`] && c[`userId_${S}`] >= 2) return;
                    if (!u.secondMessage && c[`userId_${S}`] && 1 == c[`userId_${S}`]) return;
                    if (l[`userId_${S}`] && new Date(e.updated_at) < parseInt(l[`userId_${S}`])) return;
                    try {
                        U = await f(S, (functionCallNumber = 0));
                    } catch (e) {
                        return (
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "<b>Perte de connexion avec Vinted</b> en récupérant des infos",
                                showUiMessage: !1,
                                devMessage: "error AMS-FUD - code",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !1,
                            }),
                            "fail"
                        );
                    }
                    if ("not_found" == U.errorMessage) return "skip";
                    if (null != U.errorMessage) return "fail";
                    let x,
                        I = U.user;
                    if (u.excludedVinties.includes(I.login.toLowerCase())) return;
                    if (I.is_hated) return;
                    if (a && I.feedback_reputation < n / 5 - 0.05) return;
                    try {
                        x = await h(e, (functionCallNumber = 0));
                    } catch (e) {
                        return (
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "<b>Erreur de Clemz en envoyant un message</b><br>Réessaye",
                                showUiMessage: !1,
                                devMessage: "AMS-FTUFWI-2 - code",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !1,
                            }),
                            "fail"
                        );
                    }
                    if ("skip_me" == x.errorMessage) return "skip";
                    if (null != x.errorMessage) return "fail";
                    if (!x.includes("/inbox/")) return "ignore";
                    let A,
                        k = x.match(p)[0],
                        N = g.match(p)[0];
                    try {
                        A = await b(N, k, (functionCallNumber = 0));
                    } catch (e) {
                        return (
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "<b>Erreur de Clemz en envoyant un message</b><br>Réessaye",
                                showUiMessage: !1,
                                devMessage: "AMS-FMT-2 - code",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !1,
                            }),
                            "fail"
                        );
                    }
                    if (null != A.errorMessage) return "fail";
                    let O = A.msg_thread;
                    if (O.messages.length > 0) return;
                    if (1 == O.item.is_reserved || !O.item.can_be_sold) return;
                    if (d && m <= 0) return "max_reached";
                    (messageContent = u.firstMessage), c[`userId_${S}`] && 1 == c[`userId_${S}`] && u.secondMessage && (messageContent = u.secondMessage);
                    let L = await v(1, "send_message", (optionsString = ""), (detailsJson = ""), i.activityUid);
                    if ("success" != L.message) return "fail";
                    let C,
                        E = L.activityUid;
                    if (t) {
                        let e,
                            t = O.item.price_numeric,
                            s = O.item.currency,
                            a = O.transaction.id;
                        (t = parseFloat(t)), "€" == r ? (t -= o) : (t = (t * (100 - o)) / 100), t < 1 && (t = 1), (t = t.toFixed(2));
                        try {
                            e = await M(a, t, s, E, (functionCallNumber = 0));
                        } catch (e) {
                            return void chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "Erreur de Clemz  (erreur AMS-PO)",
                                showUiMessage: !1,
                                devMessage: "error AMS-PO - code",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !1,
                            });
                        }
                        if (null != e.errorMessage) return "skip";
                    }
                    try {
                        C = await w(N, k, messageContent, E, (functionCallNumber = 0));
                    } catch (e) {
                        chrome.runtime.sendMessage({
                            message: "error",
                            origin: "code",
                            uiMessage: "Erreur de Clemz (erreur AMS-PM)",
                            showUiMessage: !1,
                            devMessage: "AMS-PM - code",
                            backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                            showProgressUiError: !1,
                        }),
                            (C = { errorMessage: !0 });
                    }
                    if (null != C.errorMessage) return "skip";
                    let R = { user_username: C.msg_thread.opposite_user.login, item_title: C.msg_thread.item.title, message_thread_id: `${C.msg_thread.id}`, fav_updated_at: e.updated_at };
                    await y("send_message", E, R, "");
                    return (c[`userId_${S}`] = c[`userId_${S}`] + 1 || 1), await chrome.storage.local.set({ autoMessageSent24hCount: c }), "message_sent";
                }
                function I(e, t, o, s) {
                    if ("" == e) return;
                    let r = document.createElement("span");
                    (r.classList = `badge badge-${t} ${o} mx-1 font-weight-normal excluded-vintie-chip`),
                        o &&
                            setTimeout(function () {
                                r.classList.remove(o);
                            }, 2e3);
                    let a = document.createElement("span");
                    if (((a.classList = "excluded-vintie-username"), (a.textContent = `@${e.replace(/[;@ ]/g, "").toLowerCase()}`), r.appendChild(a), !s)) {
                        let e = document.createElement("span");
                        e.setAttribute("role", "button"),
                            (e.classList = "px-2 font-weight-bolder h6"),
                            (e.textContent = "x"),
                            (e.href = "#"),
                            r.appendChild(e),
                            e.addEventListener("click", function () {
                                this.parentElement.remove(), k("success"), (document.querySelector("#excludedVintiesInterface").dataset.modified = "true");
                            });
                    }
                    excludedVintiesList.insertBefore(r, excludedVintiesList.firstChild);
                }
                async function A(e, t, o, s, r) {
                    let a;
                    try {
                        a = await p(e, t, o);
                    } catch (e) {
                        return void chrome.runtime.sendMessage({
                            message: "error",
                            origin: "code",
                            uiMessage: "Erreur de com avec clemz.app (erreur AMS-EAMT)",
                            showUiMessage: !0,
                            devMessage: "error AMS-EAMT - code",
                            backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                        });
                    }
                    if ("success" != a) return;
                    document.querySelector(s).remove();
                    let n = "",
                        i = 3e3;
                    "excludedVinties" == r
                        ? (n = `<br>${o.length} Vinties sont dans ta liste d'exclues.`)
                        : "editTexts" == r &&
                          (e
                              ? t || ((n = "<br>Message n°2 vide => Un seul message max sera envoyé par Vintie sur 24h (et non 2 max)"), (i = null))
                              : ((n = "<br>Message n°1 vide => Tu dois le renseigner pour utiliser les messages aux favoris."), (i = null))),
                        chrome.storage.local.set({ globalUiMessage: { content: `<b>Modifications enregistrées</b>${n}`, type: "success", time: i } });
                }
                function k(e) {
                    (document.querySelector("#excludedVintiesCount").textContent = document.querySelectorAll(".excluded-vintie-chip").length), (document.querySelector("#excludedVintiesCount").classList = `text-${e} font-weight-bold`);
                }
                t.exports = {
                    se: async function () {
                        chrome.storage.local.remove(["globalUiMessage"]), await chrome.storage.local.remove(["autoMessageCurrentCycleDate", "autoMessageCurrentCycleTabId", "autoMessageON", "autoMessageMaxTime"]), await i();
                        const e = window.location.hostname;
                        if ("success" != (await m())) return;
                        let t = await s(["userInfo", "stopShowingModals", "autoMessageParams", "activeAlertsArray"]),
                            o = t.userInfo,
                            a = t.activeAlertsArray,
                            n = t.stopShowingModals;
                        if (!o.profileUrl) return void chrome.storage.local.set({ globalUiMessage: { content: "<b>Fonctionnalité inactivée</b><br>Republie un article de ton dressing pour l'activer", type: "danger" } });
                        if (n.autoMessageWarning);
                        else {
                            if (
                                "continue" !=
                                (await (async function (e) {
                                    let t;
                                    function o() {
                                        return new Promise((e) => (waitForPressResolve = e));
                                    }
                                    function s() {
                                        waitForPressResolve && waitForPressResolve(), (t = "continue");
                                    }
                                    function a() {
                                        waitForPressResolve && waitForPressResolve(), (t = "close");
                                    }
                                    return (
                                        await fetch(chrome.runtime.getURL("html/globalModals/autoMessageWarningModal.html"))
                                            .then((e) => e.text())
                                            .then((e) => {
                                                r(e, (ignoreOutsideClick = !0), (removeTopRightCloseButton = !0)), d();
                                            }),
                                        document.querySelector("#stopShowingAutoMessageWarning").addEventListener("click", function () {
                                            (e.autoMessageWarning = this.checked), chrome.storage.local.set({ stopShowingModals: e });
                                        }),
                                        document.querySelector("#confirmLaunchingAutoMessage").addEventListener("click", s),
                                        document.querySelector("#cancelLaunchingAutoMessage").addEventListener("click", a),
                                        await o(),
                                        document.querySelector("#confirmLaunchingAutoMessage").removeEventListener("click", s),
                                        document.querySelector("#cancelLaunchingAutoMessage").removeEventListener("click", a),
                                        document.querySelector(".global-modal").remove(),
                                        u(),
                                        t
                                    );
                                })(n))
                            )
                                return;
                        }
                        if (!t.autoMessageParams || !t.autoMessageParams.firstMessage)
                            return void chrome.storage.local.set({
                                globalUiMessage: { content: '<b>Le texte n°1 à envoyer est vide.</b><br> Clique sur "Editer les textes des messages envoyés" et saisi un message à envoyer.', type: "danger" },
                            });
                        let g = c(o);
                        if ("disconnected" == g)
                            return void chrome.storage.local.set({ globalUiMessage: { content: `<p>Connecte-toi à ton compte Vinted : <a href="https://${e}/member/general/login">clique ici</a></p>`, type: "warning" } });
                        if ("admin" != o.role && "wrong profile" == g)
                            return void chrome.storage.local.set({ globalUiMessage: { content: `Tu n'es pas connecté sur Vinted au compte de @${o.username} <b>=>connecte-toi au bon compte</b>`, type: "warning", time: 5e3 } });
                        if (!o.autoMessageAllowed)
                            return void chrome.storage.local.set({
                                upgradeSubscriptionModalData:
                                    '<p class="text-center">⚠️ Ton abonnement actuel <span class="text-danger font-weight-bolder">n\'inclus pas les messages aux favoris</span><br><br>La liste des abonnements est <a href="https://www.clemz.app/pricing" target="_blank">=>disponible ici<=</a></p>',
                            });
                        if (null != o.autoMessageIncluded && o.autoMessageLeft <= 0)
                            return void chrome.storage.local.set({
                                upgradeSubscriptionModalData: `<p class="text-center">⚠️Messages aux favs : <span class="text-danger font-weight-bolder">${o.autoMessageIncluded} max / jour</span><br><br>Tu pourras envoyer de nouveaux messages demain (après minuit)</p>`,
                            });
                        let p,
                            f = document.querySelector("#ignorePastNotifications").checked,
                            h = document.querySelector("#maxDaysInPastSwitch").checked,
                            b = document.querySelector("#maxDaysInPastValue").value,
                            w = document.querySelector("#makeOffer").checked,
                            M = document.querySelector("#makeOfferValue").value,
                            v = document.querySelector("#makeOfferType").value,
                            y = document.querySelector("#checkUserFeedback").checked,
                            S = document.querySelector("#checkUserFeedbackValue").value;
                        if (
                            (chrome.storage.local.set({ ignorePastNotifications: f, maxDaysInPastSwitch: h, maxDaysInPastValue: b, makeOffer: w, makeOfferValue: M, makeOfferType: v, checkUserFeedback: y, checkUserFeedbackValue: S }),
                            (w && M < 0) || (w && "%" == v && M >= 100))
                        )
                            chrome.storage.local.set({ globalUiMessage: { content: "<b>Valeur de la remise non valide</b><br>Merci de modifier le chiffre fourni", type: "warning" } });
                        else if ("continue" == (await l("autoMessageCycle", a))) {
                            if (w && M > 15) {
                                if (!confirm(`🔔🔔🔔🔔🔔🔔🔔🔔 ATTENTION ! \n Tu vas faire des offres très basses\n ===> - ${M}${v} <==\nTu confirmes qu'il ne s'agit pas d'une erreur ?`)) return;
                            }
                            chrome.storage.local.set({
                                progressUiMessage: {
                                    currentIndex: 0,
                                    totalIndex: 2,
                                    stage: "Phase1: lecture de l'historique",
                                    articleName: "Démarrage des messages auto",
                                    articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                    showLoader: !0,
                                },
                            }),
                                await chrome.storage.local.set({ autoMessageSent24hCount: {}, autoMessageLastContactWithUser: {}, autoMessageProcessedNotif: [] });
                            try {
                                p = await U();
                            } catch (e) {
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "<b>Erreur de Clemz</b><br>Réessaye ou contacte moi à clement@clemz.app",
                                    showUiMessage: !0,
                                    devMessage: "AMS-global - code",
                                    backtrace: JSON.stringify(e, Object.getOwnPropertyNames(e)),
                                    showProgressUiError: !0,
                                });
                            }
                            "fail" != p && ("max_reached" != p ? chrome.runtime.sendMessage({ message: "autoMessageStart", hostname: e, maxDuration: o.autoMessageMaxDuration }) : chrome.storage.local.remove(["progressUiMessage"]));
                        }
                    },
                    re: U,
                    ae: async function (e) {
                        let t = (await s(["autoMessageParams"])).autoMessageParams;
                        null == t && (t = { firstMessage: "", secondMessage: "", excludedVinties: [] }),
                            fetch(chrome.runtime.getURL("html/toolModals/autoMessageEditTextsModal.html"))
                                .then((e) => e.text())
                                .then((o) => {
                                    a(o, "autoMessageEditTextsModal");
                                    let s = t.firstMessage,
                                        r = t.secondMessage,
                                        n = t.excludedVinties;
                                    if (((document.querySelector("#firstMessage").value = s), (document.querySelector("#secondMessage").value = r), e))
                                        return (
                                            (document.querySelector("#firstMessage").readOnly = !0),
                                            (document.querySelector("#secondMessage").readOnly = !0),
                                            (document.querySelector("[type='submit']").textContent = "Fermer"),
                                            (document.querySelector("[type='submit']").classList = "btn btn-dark btn-sm"),
                                            void document.querySelector("#autoMessageTextsForm").addEventListener("submit", (e) => {
                                                e.preventDefault(), document.querySelector("#autoMessageEditTextsModal").remove();
                                            })
                                        );
                                    document.querySelector("#autoMessageTextsForm").addEventListener("submit", (e) => {
                                        e.preventDefault();
                                        let t = document.querySelector("#firstMessage").value,
                                            o = document.querySelector("#secondMessage").value;
                                        t.match(/ww|htt|\.fr|\.com/i) || o.match(/ww|htt|\.fr|\.com/i)
                                            ? chrome.storage.local.set({
                                                  globalUiMessage: {
                                                      content: "<b>Attention !</b> Ne mettez pas d'adresse de site (URL) dans vos messages sinon Vinted peut vous considérer comme un spammer !",
                                                      type: "warning",
                                                      time: "6000",
                                                  },
                                              })
                                            : A(t, o, n, "#autoMessageEditTextsModal", "editTexts");
                                    });
                                });
                    },
                    ne: async function (e) {
                        let t = (await s(["autoMessageParams"])).autoMessageParams;
                        null == t && (t = { firstMessage: "", secondMessage: "", excludedVinties: [] });
                        let o = t.firstMessage,
                            r = t.secondMessage,
                            n = t.excludedVinties;
                        fetch(chrome.runtime.getURL("html/toolModals/autoMessageEditExcludedVintiesModal.html"))
                            .then((e) => e.text())
                            .then((t) => {
                                a(t, "autoMessageEditExcludedVintiesModal");
                                for (let t = n.length - 1; t >= 0; t--) I(n[t], "light", "", e);
                                if ((k("dark"), e))
                                    return (
                                        document.querySelector("#addExcludedVintie").remove(),
                                        (document.querySelector("#submitExcludedVinties").textContent = "Fermer"),
                                        (document.querySelector("#submitExcludedVinties").classList = "btn btn-dark btn-sm"),
                                        void document.querySelector("#submitExcludedVinties").addEventListener("click", (e) => {
                                            e.preventDefault(), document.querySelector("#autoMessageEditExcludedVintiesModal").remove();
                                        })
                                    );
                                document.querySelector("#addExcludedVintie").addEventListener("input", function (e) {
                                    let t = this.value.substr(-1).charCodeAt(0);
                                    (32 !== t && 59 !== t) ||
                                        (e.preventDefault(),
                                        I(this.value.replace(/[;@ ]/g, ""), "translucent-info", "bg-light-success", !1),
                                        k("success"),
                                        (document.querySelector("#addExcludedVintie").value = ""),
                                        (document.querySelector("#excludedVintiesInterface").dataset.modified = "true"));
                                }),
                                    document.querySelector("#submitExcludedVinties").addEventListener("click", function (e) {
                                        if ("" != document.querySelector("#addExcludedVintie").value)
                                            return (
                                                chrome.storage.local.set({
                                                    globalUiMessage: { content: "<b>Un nom de vintie est en cours de saisie</b><br>Appuie sur ESPACE pour l'ajouter à la liste - ensuite tu pourras enregistrer la liste.", type: "warning" },
                                                }),
                                                void document.querySelector("#addExcludedVintie").focus()
                                            );
                                        let t = document.querySelectorAll(".excluded-vintie-chip"),
                                            s = [];
                                        for (let e of t) {
                                            let t = e.querySelector(".excluded-vintie-username").textContent.replace(/[;@ ]/g, "");
                                            s.includes(t) || s.push(t.toLowerCase());
                                        }
                                        A(o, r, s, "#autoMessageEditExcludedVintiesModal", "excludedVinties"), chrome.storage.local.remove(["globalUiMessage"]);
                                    });
                            });
                    },
                };
            },
            { "./apiCalls.js": 1, "./utilities.js": 12 },
        ],
        3: [
            function (e, t, o) {
                const { t: s, ie: r, i: a, G: n, W: i, te: c, oe: l, ce: u, le: d, K: m } = e("./utilities.js"),
                    { ue: g } = e("./smartDressingScript.js"),
                    { de: p } = e("./sendFavouritesScript.js"),
                    { se: f, ae: h, ne: b } = e("./autoMessageScript.js"),
                    { me: w } = e("./selectArticlesScript.js"),
                    { ge: M } = e("./repostArticlesScript.js"),
                    { pe: v } = e("./requestFavsScript.js"),
                    { fe: y, he: U } = e("./manageListsScript.js"),
                    { be: S, we: x, Me: I } = e("./manageClipboardsScript.js"),
                    { L: A, $: k, F: N, P: O, H: L } = e("./apiCalls.js");
                async function C() {
                    const e = await s(["userInfo"]);
                    !(function () {
                        document.querySelector(".global-modal") && document.querySelector(".global-modal").remove();
                        document.querySelector(".toolModal") && document.querySelector(".toolModal").remove();
                    })(),
                        await fetch(chrome.runtime.getURL("html/interfaces/loginInterface.html"))
                            .then((e) => e.text())
                            .then((t) => {
                                document.querySelector("#currentInterface")?.remove(),
                                    document.querySelector("#globalAlertBanner")?.remove(),
                                    document.querySelector("#toolBody").insertAdjacentHTML("afterbegin", t),
                                    V(),
                                    u(),
                                    (document.querySelector("#versionNumber").innerText = `version : ${chrome.runtime.getManifest().version}`),
                                    e?.userInfo?.email && (document.querySelector("#v-email").value = e.userInfo.email);
                                let o = document.querySelectorAll("[data-open-tab]");
                                for (let e of o)
                                    e.addEventListener("click", function () {
                                        (linkName = e.dataset.openTab), (containerName = e.dataset.openTabContainer), r(containerName, linkName);
                                    });
                                document.querySelector("#minimizeButton").addEventListener("click", function () {
                                    T();
                                }),
                                    document.querySelector("#showPassword").addEventListener("click", function () {
                                        var e = document.getElementById("v-password");
                                        "password" === e.type ? (e.type = "text") : (e.type = "password");
                                    }),
                                    l(),
                                    document.querySelector("#loginForm").addEventListener("submit", (e) => {
                                        e.preventDefault();
                                        const t = document.querySelector("#v-email").value.toLowerCase(),
                                            o = document.querySelector("#v-password").value;
                                        t && o
                                            ? (document.querySelector("#v-password").classList.remove("red_placeholder"),
                                              (document.querySelector("#v-password").placeholder = "Celui de Clemz, pas de Vinted"),
                                              (document.querySelector("#v-password").value = ""),
                                              chrome.runtime.sendMessage({ message: "login", userInfo: { email: t, password: o } }))
                                            : ((document.querySelector("#v-email").placeholder = "Entrez un email"),
                                              (document.querySelector("#v-password").placeholder = "Entrez un mot de passe"),
                                              document.querySelector("#v-email").classList.add("red_placeholder"),
                                              document.querySelector("#v-password").classList.add("red_placeholder"));
                                    });
                            });
                }
                async function E() {
                    const e = await s(["userInfo", "upgradeSubscriptionModalData", "activeAlertsArray", "lastGlobalAlertReadUid"]);
                    let t;
                    (t = e.userInfo.profileUrl ? e.userInfo.profileUrl : ""),
                        await fetch(chrome.runtime.getURL("html/interfaces/actionInterface.html"))
                            .then((e) => e.text())
                            .then((t) => {
                                let o = document.querySelector("#currentInterface");
                                null != o && o.remove(),
                                    V(),
                                    document.querySelector("#toolBody").insertAdjacentHTML("afterbegin", t),
                                    u(),
                                    j(),
                                    D(),
                                    (document.querySelector("#versionNumber").innerText = `version : ${chrome.runtime.getManifest().version}`),
                                    document.querySelector("#minimizeButton").addEventListener("click", function () {
                                        T();
                                    });
                                let s = document.querySelectorAll("[data-open-tab]");
                                for (let e of s)
                                    e.addEventListener("click", function () {
                                        (linkName = e.dataset.openTab), (containerName = e.dataset.openTabContainer), r(containerName, linkName);
                                    });
                                let i = document.querySelectorAll(".refreshButton");
                                for (let e of i)
                                    e.addEventListener("click", async function () {
                                        "success" == (await A(!0)) && I();
                                    });
                                document.querySelector("#logoutButton").addEventListener("click", (e) => {
                                    chrome.runtime.sendMessage({ message: "logout" }, function (e) {
                                        "OK" == e && location.reload();
                                    });
                                }),
                                    document.querySelector("#tutorialButtonMenu").addEventListener("click", (e) => {
                                        B();
                                    }),
                                    document.querySelector("#showListsButton1").addEventListener("click", function () {
                                        U();
                                    }),
                                    document.querySelector("#selectItemsButton").addEventListener("click", (e) => {
                                        e.preventDefault(), w();
                                    }),
                                    document.querySelector("#addToListButton").addEventListener("click", function () {
                                        let e,
                                            t = document.getElementById("listSelect").value;
                                        1 == t ? (e = "mainList") : 2 == t && (e = "sideList"), y(e);
                                    }),
                                    document.querySelector("#showListsButton2").addEventListener("click", function () {
                                        U();
                                    }),
                                    document.querySelector("#repostButton").addEventListener("click", function () {
                                        (this.disabled = !0), (this.querySelector(".spinner-border").style.display = "inline");
                                        let e,
                                            t = document.getElementById("repostSelectAction").value;
                                        1 == t ? (e = "repostItems") : 2 == t ? (e = "saveItems") : 3 == t && (e = "postDrafts"), M(e);
                                    }),
                                    document.querySelector("#requestFavsButton").addEventListener("click", function () {
                                        (this.disabled = !0), (this.querySelector(".spinner-border").style.display = "inline"), v();
                                    }),
                                    document.querySelector("#smartDressingButton").addEventListener("click", function () {
                                        (this.disabled = !0), (this.querySelector(".spinner-border").style.display = "inline"), g();
                                    }),
                                    document.querySelector("#showItemsForm").addEventListener("submit", (e) => {
                                        e.preventDefault();
                                        let t = parseInt(document.getElementById("itemsBegin").value),
                                            o = parseInt(document.getElementById("itemsEnd").value);
                                        (isNaN(t) || t <= 0) && (chrome.storage.local.set({ itemsBegin: 1 }), (t = 1)),
                                            (isNaN(o) || o <= 0) && (chrome.storage.local.set({ itemsEnd: null }), (o = 99999)),
                                            t > o && (chrome.storage.local.set({ itemsBegin: 1 }), (t = 1)),
                                            g(t, o);
                                    }),
                                    document.querySelector("#autoMessageTextsButton").addEventListener("click", function () {
                                        h();
                                    }),
                                    document.querySelector("#autoMessageExcludedVintiesButton").addEventListener("click", function () {
                                        b();
                                    }),
                                    document.querySelector("#autoMessageStartButton").addEventListener("click", function () {
                                        (this.disabled = !0), (this.querySelector(".spinner-border").style.display = "inline"), f();
                                    }),
                                    document.querySelector("#createClipboardButton").addEventListener("click", function () {
                                        S();
                                    }),
                                    document.querySelector("#modifyClipboardButton").addEventListener("click", function () {
                                        let e = document.querySelectorAll(".clipboard-element-hidden");
                                        for (element of e) "BUTTON" == element.tagName ? element.classList.toggle("d-none") : element.classList.add("d-none");
                                    }),
                                    document.querySelector("#moveClipboardButton").addEventListener("click", function () {
                                        document.querySelector("input.clipboard-element-hidden").classList.contains("d-none") &&
                                            chrome.storage.local.set({ globalUiMessage: { content: "Pour déplacer un texte, changez le numéro à sa gauche (=sa place dans la liste)", type: "warning", time: 5e3 } });
                                        let e = document.querySelectorAll(".clipboard-element-hidden");
                                        for (element of e) "INPUT" == element.tagName ? element.classList.toggle("d-none") : element.classList.add("d-none");
                                    }),
                                    document.querySelector("#sendNotifToFavouritesCheckbox").addEventListener("click", async function () {
                                        event.preventDefault(),
                                            await a(100),
                                            (sendNotifState = await L("PUT", (allowNotifications = !this.checked), (activityUid = null), (functionCallNumber = 0))),
                                            sendNotifState.user &&
                                                ((this.checked = sendNotifState.user.allow_my_favourite_notifications),
                                                sendNotifState.user.allow_my_favourite_notifications
                                                    ? ((document.querySelector("#sendNotifToFavouritesLabel").textContent = "activé"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.add("text-success"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.remove("text-danger"))
                                                    : ((document.querySelector("#sendNotifToFavouritesLabel").textContent = "désactivé"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.remove("text-success"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.add("text-danger")));
                                    }),
                                    document.querySelector("#checkSendNotifToFavourites").addEventListener("click", async function () {
                                        (sendNotifState = await L("GET", (allowNotifications = null), (activityUid = null), (functionCallNumber = 0))),
                                            sendNotifState.user &&
                                                (document.querySelector("#checkSendNotifToFavourites").classList.add("d-none"),
                                                document.querySelector("#sendNotifToFavouritesControl").classList.remove("d-none"),
                                                (document.querySelector("#sendNotifToFavouritesCheckbox").checked = sendNotifState.user.allow_my_favourite_notifications),
                                                sendNotifState.user.allow_my_favourite_notifications
                                                    ? ((document.querySelector("#sendNotifToFavouritesLabel").textContent = "activé"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.add("text-success"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.remove("text-danger"))
                                                    : ((document.querySelector("#sendNotifToFavouritesLabel").textContent = "désactivé"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.remove("text-success"),
                                                      document.querySelector("#sendNotifToFavouritesLabel").classList.add("text-danger")));
                                    }),
                                    document.querySelector("#sendFavouriteForm").addEventListener("submit", function () {
                                        event.preventDefault(), (this.disabled = !0), (this.querySelector(".spinner-border").style.display = "inline"), p();
                                    }),
                                    l(),
                                    document.querySelector("#itemsBegin").addEventListener("change", function () {
                                        chrome.storage.local.set({ itemsBegin: this.value });
                                    }),
                                    document.querySelector("#itemsEnd").addEventListener("change", function () {
                                        chrome.storage.local.set({ itemsEnd: this.value });
                                    }),
                                    document.querySelector("#repostOnebyOne").addEventListener("click", function () {
                                        let e = document.querySelector("#repostOnebyOne");
                                        chrome.storage.local.set({ repostOnebyOne: e.checked });
                                    }),
                                    document.querySelector("#addViewsReposting").addEventListener("click", function (e) {
                                        let t = document.querySelector("#addViewsReposting"),
                                            o = document.querySelector("#maxViewsRepostingSelect");
                                        chrome.storage.local.set({ addViewsReposting: t.checked, maxViewsRepostingSelected: o.value });
                                    }),
                                    document.querySelector("#maxViewsRepostingSelect").addEventListener("change", function () {
                                        chrome.storage.local.set({ maxViewsRepostingSelected: document.querySelector("#maxViewsRepostingSelect").value });
                                    }),
                                    document.querySelector("#quickRepostMode").addEventListener("click", function () {
                                        !(async function () {
                                            let e = document.querySelector("#quickRepostMode");
                                            await a(100),
                                                e.checked
                                                    ? fetch(chrome.runtime.getURL("html/globalModals/quickRepostModeWarning.html"))
                                                          .then((e) => e.text())
                                                          .then((t) => {
                                                              (e.checked = !1),
                                                                  n(t, !1, !1),
                                                                  document.querySelector("#cancelQuickRepostMode").addEventListener("click", function () {
                                                                      document.querySelector(".global-modal").remove();
                                                                  }),
                                                                  document.querySelector("#confirmQuickRepostMode").addEventListener("click", function () {
                                                                      document.querySelector(".global-modal").remove(), (e.checked = !0), chrome.storage.local.set({ quickRepostMode: !0, quickRepostModeLastActivated: Date.now() });
                                                                  });
                                                          })
                                                    : chrome.storage.local.set({ quickRepostMode: !1 });
                                        })();
                                    }),
                                    document.querySelector("#repostSelectAction").addEventListener("change", function () {
                                        chrome.storage.local.set({ repostSelectAction: this.value });
                                    }),
                                    document.querySelector("#ignorePastNotifications").addEventListener("click", function () {
                                        chrome.storage.local.set({ ignorePastNotifications: this.checked });
                                    }),
                                    document.querySelector("#maxDaysInPastSwitch").addEventListener("click", function () {
                                        chrome.storage.local.set({ maxDaysInPastSwitch: this.checked });
                                    }),
                                    document.querySelector("#maxDaysInPastValue").addEventListener("change", function () {
                                        chrome.storage.local.set({ maxDaysInPastValue: document.querySelector("#maxDaysInPastValue").value });
                                    }),
                                    document.querySelector("#makeOffer").addEventListener("click", function () {
                                        chrome.storage.local.set({ makeOffer: this.checked });
                                    }),
                                    document.querySelector("#makeOfferValue").addEventListener("change", function () {
                                        chrome.storage.local.set({ makeOfferValue: document.querySelector("#makeOfferValue").value });
                                    }),
                                    document.querySelector("#makeOfferType").addEventListener("change", function () {
                                        chrome.storage.local.set({ makeOfferType: document.querySelector("#makeOfferType").value });
                                    }),
                                    document.querySelector("#checkUserFeedback").addEventListener("click", function () {
                                        chrome.storage.local.set({ checkUserFeedback: this.checked });
                                    }),
                                    document.querySelector("#checkUserFeedbackValue").addEventListener("change", function () {
                                        chrome.storage.local.set({ checkUserFeedbackValue: document.querySelector("#checkUserFeedbackValue").value });
                                    }),
                                    document.querySelector("#sendFavouritesCount").addEventListener("change", function () {
                                        chrome.storage.local.set({ sendFavouritesCount: this.value });
                                    }),
                                    document.querySelector("#addViewsSendFavs").addEventListener("click", function (e) {
                                        chrome.storage.local.set({ addViewsSendFavs: this.checked });
                                    }),
                                    document.querySelector("#turnOffNotifsFavs").addEventListener("click", function (e) {
                                        chrome.storage.local.set({ turnOffNotifsFavs: this.checked });
                                    }),
                                    e.upgradeSubscriptionModalData && q();
                                let c = e.activeAlertsArray,
                                    d = e.lastGlobalAlertReadUid;
                                if (c)
                                    for (let e of c)
                                        if ("global" == e.alert_type && e.uid != d) {
                                            Z(e);
                                            break;
                                        }
                            });
                }
                async function R() {
                    if (document.querySelector("[data-interface-name='progress'")) return void P();
                    const e = await s(["userInfo"]);
                    let t;
                    (t = e.userInfo.profileUrl ? e.userInfo.profileUrl : ""),
                        await fetch(chrome.runtime.getURL("html/interfaces/progressInterface.html"))
                            .then((e) => e.text())
                            .then((e) => {
                                if (document.querySelector("#progressUiContainer")) {
                                    let t = document.querySelector("#progressUiContainer");
                                    (t.dataset.interfaceName = "progress"), (t.innerHTML = e);
                                } else {
                                    let t = document.querySelector("#currentInterface");
                                    null != t && t.remove();
                                    let o =
                                        '\n        <div id="currentInterface" style="position: relative;" data-interface-name="progress">\n          <div class="upperButtons" id="upperButtons">\n            <div class="tabBox" id="tabBox">\n              <h6 class="progressTitle d-flex justify-content-center align-items-center">\n                <img class="vinz-image" data-image-name="bot_smiling.png" src=""><span class="ml-2 mr-3">Clemz bosse pour toi</span>\n                <span class="spinner-border text-white ml-2" role="status" id="progressMessageSpinner"><span class="sr-only"></span></span>\n              </h6>\n            </div>\n            <div class="upperRightButtons">\n              <div id="minimizeButton" class="minimizeButton"></div>\n            </div>\n          </div>\n        </div>';
                                    (document.querySelector("#toolBody").innerHTML = o),
                                        document.querySelector("#currentInterface").insertAdjacentHTML("beforeend", e),
                                        V(),
                                        document.querySelector("#minimizeButton").addEventListener("click", function () {
                                            T();
                                        });
                                }
                                u(),
                                    document.querySelector("#progressStopButton").addEventListener("click", function () {
                                        location.reload(),
                                            chrome.storage.local.remove("progressUiMessage"),
                                            chrome.storage.local.set({ autoMessageON: !1 }),
                                            chrome.runtime.sendMessage({ message: "error", origin: "user", uiMessage: "Tu as stoppé le processus", devMessage: "user clicked on STOP", backtrace: "{}", body: "-" });
                                    }),
                                    document.querySelector("#progressCloseButton").addEventListener("click", function () {
                                        chrome.storage.local.remove("progressUiMessage"), F();
                                    }),
                                    document.querySelector("#progressMinimizeButton").addEventListener("click", async function () {
                                        await T(), F(), chrome.storage.local.remove("progressUiMessage");
                                    }),
                                    document.querySelector("#progressRefreshButton").addEventListener("click", function () {
                                        chrome.storage.local.remove("progressUiMessage"), location.reload();
                                    }),
                                    document.querySelector("#progressDressingButton").addEventListener("click", function () {
                                        chrome.storage.local.remove("progressUiMessage"), t ? location.replace(`/member/${t}`) : location.reload();
                                    }),
                                    document.querySelector("#progressShowListsButton").addEventListener("click", async function () {
                                        chrome.storage.local.remove("progressUiMessage"), await F(), U();
                                    }),
                                    P();
                            });
                }
                async function T() {
                    (await s(["vinzHidden"])).vinzHidden ? J() : _();
                }
                async function J() {
                    await chrome.storage.local.set({ vinzHidden: !1 }), (document.getElementById("miniVinz").style.display = "none"), (document.getElementById("toolBody").style.display = "block");
                }
                async function _() {
                    await chrome.storage.local.set({ vinzHidden: !0 }), (document.getElementById("miniVinz").style.display = "block"), (document.getElementById("toolBody").style.display = "none");
                }
                async function $(e, t, o) {
                    e.preventDefault(), e.stopPropagation();
                    let r = (await s(["miniVinzCoordinates"])).miniVinzCoordinates,
                        a = d(e),
                        n = a.clientX - t.getBoundingClientRect().left,
                        i = a.clientY - t.getBoundingClientRect().bottom;
                    function c(e, o) {
                        let s = e - n,
                            r = window.innerHeight - o + i;
                        s <= 0 && (s = 1), r <= 0 && (r = 1), s > window.innerWidth - 85 && (s = window.innerWidth - 85), r > window.innerHeight - 85 && (r = window.innerHeight - 85), (t.style.left = s + "px"), (t.style.bottom = r + "px");
                    }
                    async function l(e) {
                        let t = d(e);
                        c(t.clientX, t.clientY);
                    }
                    async function u(e) {
                        let o = d(e),
                            s = o.clientX - t.getBoundingClientRect().left,
                            a = o.clientY - t.getBoundingClientRect().bottom,
                            n = { x: o.clientX - s, y: window.innerHeight - o.clientY + a };
                        Math.abs(r.x - n.x) < 10 && Math.abs(r.y - n.y) < 10 ? T() : chrome.storage.local.set({ miniVinzCoordinates: n }),
                            document.removeEventListener("mousemove", l),
                            document.removeEventListener("touchmove", l),
                            document.removeEventListener("mouseup", u),
                            document.removeEventListener("touchend", u);
                    }
                    c(a.clientX, a.clientY), document.addEventListener("mousemove", l), document.addEventListener("touchmove", l), document.addEventListener("mouseup", u), document.addEventListener("touchend", u);
                }
                async function F() {
                    let e = await s(["loginStatus", "progressUiMessage", "vinzHidden", "autoMessageON"]);
                    null == e.vinzHidden && (await chrome.storage.local.set({ vinzHidden: !1 }));
                    let t = e.loginStatus,
                        o = e.progressUiMessage,
                        r = e.vinzHidden,
                        a = e.autoMessageON;
                    if (
                        (t && a
                            ? (await (async function () {
                                  await fetch(chrome.runtime.getURL("html/interfaces/autoMessageInterface.html"))
                                      .then((e) => e.text())
                                      .then(async function (e) {
                                          (document.querySelector("#toolBody").innerHTML = e), V(), u();
                                          let t = await s(["makeOffer", "makeOfferValue", "makeOfferType", "checkUserFeedback", "checkUserFeedbackValue", "autoMessageNextCycleDate"]),
                                              o = t.makeOffer,
                                              r = t.makeOfferValue,
                                              a = t.makeOfferType,
                                              n = t.checkUserFeedback,
                                              i = t.checkUserFeedbackValue;
                                          o && ((document.querySelector("#makeOfferStatus").textContent = "✅"), (document.querySelector("#makeOfferShowValue").textContent = `(- ${r}${a})`)),
                                              n && ((document.querySelector("#checkUserFeedbackStatus").textContent = "✅"), (document.querySelector("#checkUserFeedbackShowValue").textContent = `(min ${i}x⭐)`)),
                                              document.querySelector("#minimizeButton").addEventListener("click", function () {
                                                  T();
                                              }),
                                              document.querySelector("#autoMessageTextsButton").addEventListener("click", function () {
                                                  h((makeReadOnly = !0));
                                              }),
                                              document.querySelector("#autoMessageExcludedVintiesButton").addEventListener("click", function () {
                                                  b((makeReadOnly = !0));
                                              }),
                                              document.querySelector("#autoMessageStopButton").addEventListener("click", function () {
                                                  chrome.storage.local.set({ autoMessageON: !1 }), chrome.runtime.sendMessage({ message: "autoMessageCycleOver" }), chrome.storage.local.remove(["progressUiMessage"]), location.reload();
                                              }),
                                              z();
                                      });
                              })(),
                              o && (await R()))
                            : t
                            ? await E()
                            : await C(),
                        r ? _() : J(),
                        document.querySelector("[data-interface-name='action'"))
                    ) {
                        e = await s([
                            "userInfo",
                            "activeTabID",
                            "repostOnebyOne",
                            "addViewsReposting",
                            "maxViewsRepostingSelected",
                            "quickRepostMode",
                            "quickRepostModeLastActivated",
                            "repostSelectAction",
                            "itemsBegin",
                            "itemsEnd",
                            "ignorePastNotifications",
                            "maxDaysInPastSwitch",
                            "maxDaysInPastValue",
                            "makeOffer",
                            "makeOfferValue",
                            "makeOfferType",
                            "checkUserFeedback",
                            "checkUserFeedbackValue",
                            "sendFavouritesCount",
                            "addViewsSendFavs",
                            "turnOffNotifsFavs",
                        ]);
                        let t = e.activeTabID,
                            o = e.userInfo;
                        (tabToSetAsActive = await X(o)), tabToSetAsActive && (t = tabToSetAsActive);
                        let r = document.querySelectorAll(".tabLinks");
                        for (button of r)
                            button.addEventListener("click", function () {
                                chrome.storage.local.set({ activeTabID: this.id });
                            });
                        for (tabLink of r) tabLink.classList.remove("active");
                        let a = document.getElementsByClassName("tabContent");
                        for (element of a) element.style.display = "none";
                        if (t && document.getElementById(t) && !document.getElementById(t).classList.contains("d-none"))
                            document.getElementById(t).classList.add("active"), (document.querySelector(`[aria-labelledby='${t}']`).style.display = "block");
                        else {
                            let e = document.querySelectorAll(".tabLinks")[0].id;
                            document.getElementById(e).classList.add("active"), document.querySelector(`[aria-labelledby='${e}']`) && (document.querySelector(`[aria-labelledby='${e}']`).style.display = "block");
                        }
                        (document.querySelector("#repostOnebyOne").checked = e.repostOnebyOne),
                            e.quickRepostModeLastActivated && Date.now() - e.quickRepostModeLastActivated > 18144e5 && ((e.quickRepostMode = !1), chrome.storage.local.set({ quickRepostMode: !1 })),
                            (document.querySelector("#quickRepostMode").checked = e.quickRepostMode),
                            (document.querySelector("#addViewsReposting").checked = e.addViewsReposting),
                            e.maxViewsRepostingSelected ? (document.querySelector("#maxViewsRepostingSelect").value = e.maxViewsRepostingSelected) : (document.querySelector("#maxViewsRepostingSelect").selectedIndex = 0),
                            (document.querySelector("#ignorePastNotifications").checked = e.ignorePastNotifications),
                            (document.querySelector("#maxDaysInPastSwitch").checked = e.maxDaysInPastSwitch),
                            (document.querySelector("#makeOffer").checked = e.makeOffer),
                            (document.querySelector("#checkUserFeedback").checked = e.checkUserFeedback),
                            (document.querySelector("#addViewsSendFavs").checked = e.addViewsSendFavs),
                            (document.querySelector("#turnOffNotifsFavs").checked = e.turnOffNotifsFavs),
                            e?.repostSelectAction && (document.getElementById("repostSelectAction").value = e.repostSelectAction),
                            e.makeOfferType && (document.getElementById("makeOfferType").value = e.makeOfferType),
                            e.maxDaysInPastValue && (document.getElementById("maxDaysInPastValue").value = e.maxDaysInPastValue),
                            e.checkUserFeedbackValue && (document.getElementById("checkUserFeedbackValue").value = e.checkUserFeedbackValue),
                            (document.getElementById("itemsBegin").value = e?.itemsBegin),
                            (document.getElementById("itemsEnd").value = e?.itemsEnd),
                            (document.getElementById("makeOfferValue").value = e?.makeOfferValue),
                            (document.getElementById("sendFavouritesCount").value = e?.sendFavouritesCount);
                    }
                }
                async function V() {
                    null == document.querySelector("#globalMessage") &&
                        (await fetch(chrome.runtime.getURL("html/partials/globalMessage.html"))
                            .then((e) => e.text())
                            .then((e) => {
                                null == document.querySelector("#globalMessage") &&
                                    (document.querySelector("#toolBody").insertAdjacentHTML("afterbegin", e),
                                    document.querySelector("#global-message-close").addEventListener("click", function (e) {
                                        chrome.storage.local.remove("globalUiMessage"), document.querySelector("#globalMessage").classList.add("invisible");
                                    }));
                            }));
                    let e = (await s(["globalUiMessage"])).globalUiMessage;
                    if (e) {
                        let t = document.getElementById("globalMessage");
                        (t.className = ""),
                            t.classList.add("alert"),
                            t.classList.add("text-sm-md"),
                            t.classList.add(`alert-${e.type}`),
                            "warning" == e.type && t.classList.add("text-dark"),
                            (t.querySelector("#globalMessageContent").innerHTML = e.content),
                            e.time &&
                                e.time > 0 &&
                                setTimeout(function () {
                                    chrome.storage.local.remove("globalUiMessage"), document.querySelector("#globalMessage").classList.add("invisible");
                                }, e.time),
                            e.short ? (t.style.width = "250px") : (t.style.width = "");
                    } else document.getElementById("globalMessage") && document.getElementById("globalMessage").classList.add("invisible");
                    c();
                }
                async function z() {
                    if (null == document.querySelector("[data-interface-name='autoMessage'")) return;
                    const e = await s(["autoMessageNextCycleDate", "progressUiMessage", "autoMessageMaxTime"]);
                    let t,
                        o = new Date(e.autoMessageNextCycleDate);
                    e.autoMessageMaxTime && (t = new Date(e.autoMessageMaxTime));
                    const r = e.progressUiMessage;
                    if (r && r.stage) return;
                    if (o < new Date())
                        return (
                            (document.querySelector("#autoMessageSpinner").style.display = "none"),
                            (document.querySelector("#autoMessageStatus").textContent = "Erreur"),
                            document.querySelector("#autoMessageStatus").classList.remove("text-success"),
                            document.querySelector("#autoMessageStatus").classList.add("text-danger"),
                            document.querySelector("#minutesValue") && (document.querySelector("#minutesValue").textContent = "--"),
                            void (document.querySelector("#secondsValue") && (document.querySelector("#secondsValue").textContent = "--"))
                        );
                    (document.querySelector("#autoMessageSpinner").style.display = "block"), (document.querySelector("#progressUiContainer").dataset.autoMessageNextCycleDate = `${o.getTime()}`);
                    let a = setInterval(async function () {
                        var e = 1e3,
                            t = 6e4,
                            s = new Date(),
                            r = o - s;
                        if (null == document.querySelector("[data-interface-name='autoMessage'")) return void clearInterval(a);
                        let n = parseInt(document.querySelector("#progressUiContainer").dataset.autoMessageNextCycleDate);
                        if (r < -2e4)
                            return (
                                n > o.getTime() ||
                                    ((document.querySelector("#autoMessageSpinner").style.display = "none"),
                                    (document.querySelector("#autoMessageStatus").textContent = "Erreur"),
                                    document.querySelector("#autoMessageStatus").classList.remove("text-success"),
                                    document.querySelector("#autoMessageStatus").classList.add("text-danger"),
                                    document.querySelector("#minutesValue") && (document.querySelector("#minutesValue").textContent = "--"),
                                    document.querySelector("#secondsValue") && (document.querySelector("#secondsValue").textContent = "--")),
                                void clearInterval(a)
                            );
                        if (r < 0) {
                            if (n > o.getTime()) return void clearInterval(a);
                            document.querySelector("#minutesValue") && (document.querySelector("#minutesValue").textContent = "--"), document.querySelector("#secondsValue") && (document.querySelector("#secondsValue").textContent = "--");
                        } else {
                            var i = Math.floor((r % 36e5) / t),
                                c = Math.floor((r % t) / e);
                            60 == (c = 5 * Math.ceil(c / 5)) && ((c = 0), i++),
                                document.querySelector("#minutesValue") && (document.querySelector("#minutesValue").textContent = i),
                                document.querySelector("#secondsValue") && (document.querySelector("#secondsValue").textContent = c.toLocaleString("fr-FR", { minimumIntegerDigits: 2 }));
                        }
                    }, 2e3);
                    t &&
                        (document.querySelector("#autoMessageMaxTimeContainer").classList.remove("d-none"),
                        (document.querySelector("#autoMessageMaxTime").textContent = `${t.getHours()}h${t.getMinutes().toLocaleString("fr-FR", { minimumIntegerDigits: 2 })}`));
                }
                async function P() {
                    const e = (await s(["progressUiMessage"])).progressUiMessage;
                    if (e && e.stage) {
                        let t = document.querySelector(".progress-bar-vinz"),
                            o = document.querySelector(".progress-tooltip"),
                            s = (e.currentIndex / e.totalIndex) * 100;
                        e.progressInPercent ? (o.innerHTML = `${Math.round(s)} %`) : (o.innerHTML = `${e.currentIndex} / ${e.totalIndex}`),
                            (o.style = `left: ${s}%`),
                            0 == e.currentIndex ? (t.style = "") : (t.style.width = (e.currentIndex / e.totalIndex) * 100 + "%"),
                            null == document.getElementById("progressMessageSpinner") ||
                                (e.showLoader ? (document.getElementById("progressMessageSpinner").style.display = "block") : (document.getElementById("progressMessageSpinner").style.display = "none")),
                            e.articleImageUrl && (document.getElementById("progressImage").src = e.articleImageUrl);
                        let r = document.querySelector("#articleTitle");
                        "" == e.articleName ? (r.innerHTML = "") : (r.innerHTML = `${e.articleName.trim()}`),
                            (document.querySelector("#processStage").innerHTML = `${e.stage}`),
                            e.processFinishedButton && "false" == e.processFinishedButton && (document.getElementById("progressStopButton").style.display = "none"),
                            e.processFinishedButton &&
                                e.processFinishedButton.includes("close") &&
                                ((document.getElementById("progressStopButton").style.display = "none"), (document.getElementById("progressCloseButton").style.display = "block")),
                            e.processFinishedButton &&
                                e.processFinishedButton.includes("refresh") &&
                                ((document.getElementById("progressStopButton").style.display = "none"), (document.getElementById("progressRefreshButton").style.display = "block")),
                            e.processFinishedButton &&
                                e.processFinishedButton.includes("showLists") &&
                                ((document.getElementById("progressStopButton").style.display = "none"), (document.getElementById("progressShowListsButton").style.display = "block")),
                            e.processFinishedButton &&
                                e.processFinishedButton.includes("dressing") &&
                                ((document.getElementById("progressStopButton").style.display = "none"), (document.getElementById("progressDressingButton").style.display = "block")),
                            e.processFinishedButton &&
                                e.processFinishedButton.includes("minimize") &&
                                ((document.getElementById("progressStopButton").style.display = "none"),
                                (document.getElementById("progressMinimizeButton").style.display = "block"),
                                document.querySelector("#minimizeButton").addEventListener("click", function () {
                                    chrome.storage.local.remove("progressUiMessage");
                                }));
                    } else F();
                }
                async function j() {
                    const e = await s(["userInfo", "loginStatus", "stopShowingModals", "maxViewsRepostingSelected", "mainList"]);
                    if (null == document.querySelector("[data-interface-name='action'") || !e.loginStatus) return;
                    let t = e.userInfo,
                        o = e.maxViewsRepostingSelected,
                        r = e.stopShowingModals;
                    if ((null == r && (chrome.storage.local.set({ stopShowingModals: {} }), (r = {})), null != t.updatedAt && Date.now() - t.updatedAt > 18e5)) {
                        if ("success" != (await A(!1))) return;
                        t = (await s(["userInfo"])).userInfo;
                    }
                    (document.querySelector("#userInformations").style.display = "block"),
                        (document.querySelector("#handlePastDue").style.display = "none"),
                        (document.querySelector("#subscribeCTA").style.display = "none"),
                        (document.querySelector("#userSubscriptionName").className = "text-danger font-weight-bolder"),
                        (document.querySelector("#userSubscriptionName").textContent = "Aucun"),
                        (document.querySelector("#userInfoRepostLeft").textContent = "---"),
                        (document.querySelector("#userInfoMaxRepostLeft").textContent = ""),
                        (document.querySelector("#userInfoNextTopUp").textContent = "---"),
                        document.querySelector("#userInfoAutoMessageNotAllowed").classList.remove("d-none"),
                        document.querySelector("#userInfoAutoMessageAllowed").classList.add("d-none"),
                        (document.querySelector("#userInfoAutoMessageLeft").textContent = "---"),
                        (document.querySelector("#userInfoAutoMessageIncluded").textContent = ""),
                        (document.querySelector("#userInfoAutoMessageMaxDuration").textContent = "???"),
                        (document.querySelector("#maxViewsRepostingSelect").innerHTML = "<option value='10' >10</option><option value='20' >20</option>"),
                        (document.querySelector("#lastRequestFavDate").innerHTML = "???");
                    for (let e of document.querySelectorAll(".tutorial-divs")) e.style.display = "none";
                    (document.querySelector("#userInfoEmail").textContent = `${t.email}`),
                        (document.querySelector("#userInfoUsername").textContent = `@${t.username}`),
                        t.subscription &&
                            ((document.querySelector("#userSubscriptionName").className = "text-success font-weight-bolder"),
                            (document.querySelector("#userSubscriptionName").textContent = t.subscription),
                            (t.repostLeft || 0 == t.repostLeft) &&
                                ((document.querySelector("#userInfoRepostLeft").textContent = t.repostLeft),
                                (document.querySelector("#userInfoMaxRepostLeft").textContent = ` / ${t.maxRepostLeft}`),
                                t.nextTopUp && (document.querySelector("#userInfoNextTopUp").innerHTML = `${t.nextTopUp} <span class="text-sm text-muted">(inclus)</span>`)),
                            t.autoMessageAllowed &&
                                (document.querySelector("#userInfoAutoMessageNotAllowed").classList.add("d-none"),
                                document.querySelector("#userInfoAutoMessageAllowed").classList.remove("d-none"),
                                t.autoMessageIncluded || 0 == t.autoMessageIncluded
                                    ? ((document.querySelector("#userInfoAutoMessageLeft").textContent = t.autoMessageLeft), (document.querySelector("#userInfoAutoMessageIncluded").textContent = ` / ${t.autoMessageIncluded}`))
                                    : (document.querySelector("#userInfoAutoMessageLeft").textContent = "illimité !"),
                                t.autoMessageMaxDuration || 0 == t.autoMessageMaxDuration
                                    ? (document.querySelector("#userInfoAutoMessageMaxDuration").textContent = `${t.autoMessageMaxDuration}h`)
                                    : (document.querySelector("#userInfoAutoMessageMaxDuration").textContent = "illimité !"))),
                        t.lastRequestFavs
                            ? (document.querySelector("#lastRequestFavDate").innerHTML = `<span class='text-success font-weight-bolder'>${t.lastRequestFavs}</span>`)
                            : (document.querySelector("#lastRequestFavDate").innerHTML = "<span class='text-danger font-weight-bolder'>Aucune</span>");
                    let a = document.querySelectorAll(".profileLink");
                    for (let e of a) t.profileUrl ? (e.href = `https://${window.location.hostname}/member/${t.profileUrl}`) : (e.style.display = "none");
                    let i = t.maxViews;
                    if (i > 0) {
                        let e = document.querySelector("#maxViewsRepostingSelect");
                        e.innerHTML = "";
                        let t,
                            s = "";
                        for (let e = 1; 10 * e <= i; e++) (t = 10 * e == o ? "selected" : ""), (s += `<option value="${10 * e}" ${t}>${10 * e}</option>`);
                        e.innerHTML = s;
                    }
                    if ("new" == t.status || "another_trial_possible" == t.status) {
                        (document.querySelector("#userSubscriptionInfos").style.display = "none"), (current_url = window.location.href);
                        const e = await s(["mainList"]);
                        "disconnected" == m(!1)
                            ? (document.querySelector("#askingToLoginVintedProfile").style.display = "block")
                            : "ok" != m(!1)
                            ? ((document.querySelector("#askingToGoToProfile").style.display = "block"),
                              t.profileUrl ? (document.querySelector("#no-profile-instructions").style.display = "none") : (document.querySelector("#go-to-profile-button").style.display = "none"))
                            : !e?.mainList?.length > 0
                            ? (document.querySelector("#askingToAddItemsToList").style.display = "block")
                            : (document.querySelector("#askingToStartRepost").style.display = "block");
                    } else
                        "past_due" == t.status
                            ? ((document.querySelector("#userSubscriptionInfos").style.display = "none"), (document.querySelector("#handlePastDue").style.display = "block"))
                            : ("on_trial" != t.status && "not_active" != t.status) || (document.querySelector("#subscribeCTA").style.display = "block");
                    t.newTrialLaunchedToday &&
                        ((r?.newTrialModal && r.newTrialModal == new Date(Date.now()).setHours(0, 0, 0, 0)) ||
                            (async function (e) {
                                fetch(chrome.runtime.getURL("html/globalModals/newTrialStartingModal.html"))
                                    .then((e) => e.text())
                                    .then((t) => {
                                        n(t, (ignoreOutsideClick = !0), (removeTopRightCloseButton = !0)),
                                            u(),
                                            l(),
                                            (document.querySelector("#end-date").textContent = new Date(Date.parse(e.end_date)).toLocaleString("fr", { month: "short", day: "numeric", year: "numeric" })),
                                            (document.querySelector("#repost-included").textContent = e.repost_included),
                                            (document.querySelector("#views-included").textContent = e.views_included),
                                            (document.querySelector("#auto-message-included").textContent = e.auto_message_included),
                                            (document.querySelector("#auto-message-max-duration").textContent = e.auto_message_max_duration),
                                            document.querySelector("#closeModal").addEventListener("click", function () {
                                                document.querySelector(".global-modal").remove(),
                                                    chrome.storage.local.get(["stopShowingModals"]).then((e) => {
                                                        let t = e.stopShowingModals;
                                                        null == t && (t = {}), (t.newTrialModal = new Date(Date.now()).setHours(0, 0, 0, 0)), chrome.storage.local.set({ stopShowingModals: t });
                                                    });
                                            }),
                                            document.querySelector("#presentingNewTrialButton").addEventListener("click", function () {
                                                (document.querySelector("#presentingNewTrialButton").style.display = "none"),
                                                    (document.querySelector("#presentingNewTrial").style.display = "none"),
                                                    (document.querySelector("#repostingTipsButton").style.display = "flex"),
                                                    (document.querySelector("#repostingTips").style.display = "flex");
                                            }),
                                            document.querySelector("#repostingTipsButton").addEventListener("click", function () {
                                                (document.querySelector("#presentingNewTrialButton").style.display = "flex"),
                                                    (document.querySelector("#presentingNewTrial").style.display = "flex"),
                                                    (document.querySelector("#repostingTipsButton").style.display = "none"),
                                                    (document.querySelector("#repostingTips").style.display = "none");
                                            });
                                    });
                            })(t.newTrialLaunchedToday));
                }
                async function D() {
                    const e = await s(["clipboardIndex", "clipboardUpdatedAt"]);
                    let t = e.clipboardIndex,
                        o = e.clipboardUpdatedAt;
                    if (null == document.querySelector("#clipboardIndex")) return;
                    if (null == o || Date.now - o > 216e5) {
                        if ("success" != (await k())) return;
                    }
                    let r = document.querySelector("#clipboardIndex");
                    if (((r.innerHTML = ""), null == t || 0 == t.length))
                        return void (r.innerHTML =
                            '\n      <div class="d-flex flex-column">\n        <div class="pt-4 pb-4 font-weight-bold h5 text-center">-- Aucun texte enregistré --</div>\n        <div class="pb-2 font-weight-bold h6 text-center">Clique sur "➕ nouveau" pour enregistrer<br> un texte que tu écris souvent</div>\n        <div class="pb-4 font-weight-bold h6 text-center">Tu pourras ensuite facilement le copier <br> puis le coller dans Vinted</div>\n      </div>\n      ');
                    let a = document.querySelector("#clipboardTemplate");
                    let n = 0;
                    for (clipboard of t) {
                        n++;
                        let e = a.cloneNode(!0),
                            t = clipboard.id,
                            o = clipboard.content,
                            s = clipboard.title;
                        (e.id = ""),
                            e.setAttribute("data-id", clipboard.id),
                            (e.querySelector(".clipboardTitle").textContent = clipboard.title),
                            (e.querySelector(".clipboardContent").textContent = clipboard.content),
                            e.querySelector(".copyClipboardButton").addEventListener("click", function () {
                                navigator.clipboard.writeText(o), chrome.storage.local.set({ globalUiMessage: { content: "<b>Texte copié.</b> CTRL+V pour le coller. ", type: "success", time: 3e3, short: !0 } });
                            }),
                            e.querySelector(".deleteClipboardButton").addEventListener("click", async function () {
                                if (!confirm(`🛑 Confirmes-tu la suppression du message ? \n\n "${o}"`)) return;
                                "success" == (await N(t)) && chrome.storage.local.set({ globalUiMessage: { content: "Le texte enregistré a été supprimé ", type: "success", time: 3e3 } });
                            }),
                            e.querySelector(".updateClipboardButton").addEventListener("click", async function () {
                                x(t, s, o);
                            }),
                            (e.querySelector("input").value = n),
                            e.querySelector("input").addEventListener("change", function (e) {
                                O(this.parentNode.dataset.id, this.value);
                            }),
                            r.appendChild(e);
                    }
                }
                async function X(e) {
                    let t = window.location.href;
                    if ("past_due" == e.status) return "homeTabLink";
                    if ("new" == e.status || "another_trial_possible" == e.status) {
                        if (("another_trial_possible" == e.status && (document.querySelector("#no-activity-for-6-months").style.display = "block"), document.querySelector("#explainTabsTabLink").classList.add("d-none"), "ok" != m(!1)))
                            return "homeTabLink";
                        {
                            document.querySelector("#listsTabLink").classList.remove("d-none"), (dataFromStorage = await s(["mainList", "stopShowingModals"]));
                            let e = dataFromStorage.stopShowingModals;
                            return (
                                null == e && (chrome.storage.local.set({ stopShowingModals: {} }), (e = {})),
                                e.repostTutorial || B((showStopCheckbox = !0)),
                                dataFromStorage.mainList?.length > 0 ? (document.querySelector("#repostTabLink").classList.remove("d-none"), "repostTabLink") : "listsTabLink"
                            );
                        }
                    }
                    if (e.profileUrl && t.includes(e.profileUrl))
                        document.querySelector("#listsTabLink").classList.remove("d-none"), document.querySelector("#repostTabLink").classList.remove("d-none"), document.querySelector("#smartDressingTabLink").classList.remove("d-none");
                    else if (t.includes("search_text") && !t.includes("member/general/search")) document.querySelector("#listsTabLink").classList.remove("d-none"), document.querySelector("#repostTabLink").classList.remove("d-none");
                    else if (e.profileUrl && t.match(/\/member\/[0-9]{4,}/g))
                        "admin" == e.role && document.querySelector("#smartDressingTabLink").classList.remove("d-none"), document.querySelector("#sendFavouritesTabLink").classList.remove("d-none");
                    else if (t.includes("/inbox")) document.querySelector("#autoMessageTabLink").classList.remove("d-none"), document.querySelector("#clipboardTabLink").classList.remove("d-none");
                    else {
                        if (!t.includes("/items/") || t.includes("/items/favourite_list")) return "explainTabsTabLink";
                        document.querySelector("#clipboardTabLink").classList.remove("d-none");
                    }
                    return !1;
                }
                async function B(e) {
                    fetch(chrome.runtime.getURL("html/globalModals/repostTutorial.html"))
                        .then((e) => e.text())
                        .then((t) => {
                            n(t, !1, !1),
                                (document.querySelector("#tutorialLogo").src = chrome.runtime.getURL("images/Clemz_logo_no_bg.png")),
                                document.querySelector("#repostVideoButton").addEventListener("click", function () {
                                    document.querySelector("#repostVideo").classList.remove("d-flex"),
                                        document.querySelector("#repostVideo").classList.add("d-none"),
                                        document.querySelector("#repostVideoButton").classList.add("d-none"),
                                        document.querySelector("#repostingTips").classList.remove("d-none"),
                                        document.querySelector("#repostingTipsButton").classList.remove("d-none");
                                }),
                                document.querySelector("#repostingTipsButton").addEventListener("click", function () {
                                    document.querySelector("#repostVideo").classList.add("d-flex"),
                                        document.querySelector("#repostVideo").classList.remove("d-none"),
                                        document.querySelector("#repostVideoButton").classList.remove("d-none"),
                                        document.querySelector("#repostingTips").classList.add("d-none"),
                                        document.querySelector("#repostingTips").classList.remove("d-flex"),
                                        document.querySelector("#repostingTipsButton").classList.add("d-none");
                                }),
                                e &&
                                    (document.querySelector("#stopShowingRepostTutorialDiv").classList.remove("d-none"),
                                    document.querySelector("#stopShowingRepostTutorial").addEventListener("click", function () {
                                        chrome.storage.local.get(["stopShowingModals"]).then((e) => {
                                            let t = e.stopShowingModals;
                                            (t.repostTutorial = document.querySelector("#stopShowingRepostTutorial").checked), chrome.storage.local.set({ stopShowingModals: t });
                                        });
                                    }));
                        });
                }
                async function q() {
                    const e = await s(["upgradeSubscriptionModalData", "userInfo"]);
                    let t = e.upgradeSubscriptionModalData,
                        o = e.userInfo;
                    fetch(chrome.runtime.getURL("html/globalModals/upgradeSubscriptionModal.html"))
                        .then((e) => e.text())
                        .then((e) => {
                            n(e, (ignoreOutsideClick = !0), (removeTopRightCloseButton = !0)),
                                u(),
                                l(),
                                (document.querySelector("#upgradeSubscriptionModalContextMessage").innerHTML = t),
                                document.querySelector("#closeUpgradeSubscriptionModal").addEventListener("click", function () {
                                    document.querySelector(".global-modal").remove(), chrome.storage.local.remove(["upgradeSubscriptionModalData"]);
                                }),
                                "on_trial" == o.status && ((document.querySelector("#contact-button").style.display = "none"), (document.querySelector("#subscribe-button").style.display = "block"));
                        });
                }
                function Z(e) {
                    fetch(chrome.runtime.getURL("html/partials/globalAlertBanner.html"))
                        .then((e) => e.text())
                        .then((t) => {
                            document.querySelector("#globalAlertBanner")?.remove(),
                                document.querySelector("#toolBody").insertAdjacentHTML("afterbegin", t),
                                e.ui_title && (document.querySelector("#alert-ui-title").innerHTML = e.ui_title),
                                document.querySelector("#globalAlertBanner").addEventListener("click", function () {
                                    n(e.message, !0, !0);
                                    let t = document.createElement("div");
                                    (t.innerHTML =
                                        '\n      <div class="d-flex justify-content-end align-items-center mt-2">\n        <div class="w-100" id="alert-can-be-muted">\n          <input type="checkbox" id="stopShowingGlobalAlert">\n          <label for="stopShowingGlobalAlert">Message lu - ne plus afficher</label>\n        </div>\n        <div class="btn btn-outline-dark" id="closeGlobalAlertButton" role="button">Fermer</div>\n      </div>'),
                                        document.querySelector(".global-modal-content").appendChild(t),
                                        0 == e.can_be_muted && (document.querySelector("#alert-can-be-muted").style.display = "none"),
                                        document.querySelector("#closeGlobalAlertButton").addEventListener("click", function () {
                                            document.querySelector("#stopShowingGlobalAlert").checked && (chrome.storage.local.set({ lastGlobalAlertReadUid: e.uid }), document.querySelector("#globalAlertBanner").remove()),
                                                document.querySelector(".global-modal").remove();
                                        });
                                });
                        });
                }
                t.exports = {
                    ve: async function () {
                        let e = document.createElement("div");
                        (e.className = "toolBody"), (e.id = "toolBody"), document.body.appendChild(e);
                        let t = document.createElement("div");
                        (t.className = "miniVinz"), (t.id = "miniVinz"), (t.style.display = "none");
                        let o = document.createElement("img");
                        (o.className = "miniVinzLogo"), (o.id = "miniVinzLogo"), (o.src = chrome.runtime.getURL("images/Clemz_logo_short_128x128.png")), t.appendChild(o), document.body.appendChild(t);
                        let r = (await s(["miniVinzCoordinates"])).miniVinzCoordinates;
                        (!r || !r.x || !r.y || r.x > window.innerWidth - 85 || r.x < 0 || r.y > window.innerHeight - 85 || r.y < 0) && ((r = { x: 3, y: 3 }), chrome.storage.local.set({ miniVinzCoordinates: r })),
                            (t.style.left = `${r.x}px`),
                            (t.style.bottom = `${r.y}px`),
                            t.addEventListener("mousedown", function () {
                                $(event, this, "mouse");
                            }),
                            t.addEventListener("touchstart", function () {
                                $(event, this, "touch");
                            }),
                            (t.ondragstart = function () {
                                return !1;
                            }),
                            chrome.storage.onChanged.addListener(async function (e, t) {
                                let o = !1,
                                    s = !1,
                                    r = !1,
                                    a = !1,
                                    n = !1,
                                    i = !1,
                                    c = !1,
                                    l = !1;
                                for (var u in e)
                                    ["autoMessageON"].includes(u) && (i = !0),
                                        ["autoMessageNextCycleDate"].includes(u) && (c = !0),
                                        ["globalUiMessage"].includes(u) && (o = !0),
                                        ["progressUiMessage"].includes(u) && (s = !0),
                                        ["userInfo"].includes(u) && (r = !0),
                                        ["loginStatus"].includes(u) && (a = !0),
                                        ["clipboardIndex"].includes(u) && (n = !0),
                                        ["upgradeSubscriptionModalData"].includes(u) && e.upgradeSubscriptionModalData.newValue && (l = !0);
                                a && (await F()), i && (await F()), c && (await z()), s && (await R()), r && (await j()), o && (await V()), n && (await D()), l && q();
                            });
                    },
                    ye: F,
                    Ue: function () {
                        fetch(chrome.runtime.getURL("html/globalModals/autoMessageNewTabMessage.html"))
                            .then((e) => e.text())
                            .then((e) => {
                                (document.querySelector("title").textContent = "Clemz - ne pas fermer"), (document.querySelector("body").innerHTML = ""), document.querySelector("body").insertAdjacentHTML("afterbegin", e);
                                let t = new Date(new Date().getTime() + 6e5);
                                (document.querySelector("#maxClosingTime").textContent = `${t.getHours()}h${t.getMinutes().toLocaleString("fr-FR", { minimumIntegerDigits: 2 })}`), u();
                            });
                    },
                };
            },
            {
                "./apiCalls.js": 1,
                "./autoMessageScript.js": 2,
                "./manageClipboardsScript.js": 5,
                "./manageListsScript.js": 6,
                "./repostArticlesScript.js": 7,
                "./requestFavsScript.js": 8,
                "./selectArticlesScript.js": 9,
                "./sendFavouritesScript.js": 10,
                "./smartDressingScript.js": 11,
                "./utilities.js": 12,
            },
        ],
        4: [
            function (e, t, o) {
                const { ve: s, ye: r, Ue: a } = e("./interface.js"),
                    { re: n } = e("./autoMessageScript.js");
                if (window.location.href.includes("autoMessage"))
                    return (
                        a(),
                        void (async function () {
                            "max_reached" == (await n()) && (await chrome.storage.local.set({ autoMessageON: !1 }));
                            await chrome.storage.local.remove(["globalUiMessage"]), chrome.runtime.sendMessage({ message: "autoMessageCycleOver", fromTabToClose: !0 });
                        })()
                    );
                try {
                    !(async function () {
                        await chrome.storage.local.set({ prodUrl: "https://www.clemz.app" }), chrome.runtime.sendMessage({ message: "checkStoredLog" }), await s(), await r();
                    })();
                } catch (e) {
                    chrome.runtime.sendMessage({
                        message: "error",
                        origin: "code",
                        uiMessage: "<b>Erreur de Clemz</b><br>Relance-moi ou contacte moi à clement@clemz.app",
                        showUiMessage: !0,
                        devMessage: "MainStart-global - code",
                        backtrace: JSON.stringify(e, Object.getOwnPropertyNames(e)),
                        showProgressUiError: !0,
                    });
                }
            },
            { "./autoMessageScript.js": 2, "./interface.js": 3 },
        ],
        5: [
            function (e, t, o) {
                const { t: s, W: r } = e("./utilities.js"),
                    { _: a, $: n, V: i } = e("./apiCalls.js");
                t.exports = {
                    be: async function () {
                        fetch(chrome.runtime.getURL("html/toolModals/newClipboardModal.html"))
                            .then((e) => e.text())
                            .then((e) => {
                                r(e, "newClipboardModal"),
                                    document.querySelector("#clipboardForm").addEventListener("submit", (e) => {
                                        e.preventDefault(),
                                            (async function () {
                                                let e,
                                                    t = document.querySelector("#clipboardTitle").value,
                                                    o = document.querySelector("#clipboardContent").value;
                                                try {
                                                    e = await a(t, o);
                                                } catch (e) {
                                                    return void chrome.runtime.sendMessage({
                                                        message: "error",
                                                        origin: "code",
                                                        uiMessage: "Erreur de com avec clemz.app (erreur MCSANC)",
                                                        devMessage: "XXXXX error MCS.js - function ANC - error XXXXX",
                                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                    });
                                                }
                                                if ("success" != e) return;
                                                document.querySelector("#newClipboardModal").remove(), chrome.storage.local.set({ globalUiMessage: { content: "Le texte a bien été enregistré", type: "success", time: 3e3 } });
                                            })();
                                    });
                            });
                    },
                    we: async function (e, t, o) {
                        fetch(chrome.runtime.getURL("html/toolModals/newClipboardModal.html"))
                            .then((e) => e.text())
                            .then((s) => {
                                document.querySelector("#toolBody").insertAdjacentHTML("afterbegin", s),
                                    document.querySelector("#close-modal").addEventListener("click", function () {
                                        document.querySelector("#newClipboardModal").remove();
                                    }),
                                    (document.querySelector("#newClipboardModalTitle").textContent = "Modifier le texte"),
                                    (document.querySelector("#newClipboardModalButton").textContent = "Modifier"),
                                    (document.querySelector("#clipboardTitle").value = t),
                                    (document.querySelector("#clipboardContent").value = o),
                                    document.querySelector("#clipboardForm").addEventListener("submit", (t) => {
                                        t.preventDefault(),
                                            (async function (e) {
                                                let t,
                                                    o = document.querySelector("#clipboardTitle").value,
                                                    s = document.querySelector("#clipboardContent").value;
                                                try {
                                                    t = await i(e, o, s);
                                                } catch (e) {
                                                    return void chrome.runtime.sendMessage({
                                                        message: "error",
                                                        origin: "code",
                                                        uiMessage: "Erreur de com avec clemz.app (erreur MCSMC)",
                                                        devMessage: "XXXXX error MCS.js - function MC - error XXXXX",
                                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                    });
                                                }
                                                if ("success" != t) return;
                                                document.querySelector("#newClipboardModal").remove(), chrome.storage.local.set({ globalUiMessage: { content: "Le texte a bien été modifié", type: "success", time: 3e3 } });
                                            })(e);
                                    });
                            });
                    },
                    Me: async function () {
                        let e;
                        try {
                            e = await n();
                        } catch (e) {
                            return void chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "Erreur de com avec clemz.app (erreur MCSLAC)",
                                devMessage: "XXXXX error MCS.js - function LAC - error XXXXX",
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                            });
                        }
                    },
                };
            },
            { "./apiCalls.js": 1, "./utilities.js": 12 },
        ],
        6: [
            function (e, t, o) {
                const { Se: s, G: r, W: a, t: n, ie: i, ce: c, Y: l, l: u } = e("./utilities.js"),
                    { u: d, g: m } = e("./apiCalls.js");
                async function g(e, t, o) {
                    let s = (await n([e]))[e],
                        r = 0;
                    for (itemId of t) {
                        let e = s.find((e) => e.id == itemId);
                        e && e.majorError ? ((userChoiceOnMajorError = await h(e, "delete")), "delete" == userChoiceOnMajorError && ((s = s.filter((e) => e.id != itemId)), (r += 1))) : ((s = s.filter((e) => e.id != itemId)), (r += 1));
                    }
                    await chrome.storage.local.set({ [e]: s }), o && r > 0 && (M(e, s), chrome.storage.local.set({ globalUiMessage: { content: "Articles supprimés de la liste", type: "success", time: 2e3 } }));
                }
                function p(e) {
                    let t;
                    t = null == e.item.photos[0] ? chrome.runtime.getURL("images/empty_placeholder.png") : e.item.photos[0].thumbnails[0].url;
                    let o = e.item.url;
                    return (
                        e.item.is_draft && (o = `/items/${e.item.id}/edit`),
                        {
                            id: e.item.id,
                            title: e.item.title,
                            is_hidden: e.item.is_hidden,
                            is_reserved: e.item.is_reserved,
                            is_draft: e.item.is_draft,
                            promoted: e.item.promoted,
                            can_be_sold: e.item.can_be_sold,
                            full_data: e.item,
                            url: o,
                            thumbnail_url: t,
                        }
                    );
                }
                async function f(e, t, o) {
                    let s = (await n([e]))[e];
                    const r = s.findIndex((e) => e.id === t);
                    -1 != r && (s.splice(r, 1, o), await chrome.storage.local.set({ [e]: s }));
                }
                async function h(e, t) {
                    let o;
                    function s() {
                        waitForPressResolve && waitForPressResolve(), (o = "repost");
                    }
                    function a() {
                        waitForPressResolve && waitForPressResolve(), (o = "delete");
                    }
                    function n() {
                        waitForPressResolve && waitForPressResolve(), (o = "cancel");
                    }
                    return (
                        await fetch(chrome.runtime.getURL("html/globalModals/majorErrorItemModificationModal.html"))
                            .then((e) => e.text())
                            .then((o) => {
                                r(o, (ignoreOutsideClick = !0), (removeTopRightCloseButton = !0)),
                                    (document.querySelector("#itemTitle").textContent = e.title),
                                    (document.querySelector("#itemError").textContent = `"${e.error}"`),
                                    (document.querySelector("#itemThumbnail").src = e.thumbnail_url),
                                    "repost" == t
                                        ? (document.querySelector("#choiceForRepost").classList.remove("d-none"), document.querySelector("#confirmMajorErrorRepost").classList.remove("d-none"))
                                        : (document.querySelector("#choiceForDelete").classList.remove("d-none"), document.querySelector("#confirmMajorErrorDelete").classList.remove("d-none"));
                            }),
                        document.querySelector("#confirmMajorErrorRepost").addEventListener("click", s),
                        document.querySelector("#confirmMajorErrorDelete").addEventListener("click", a),
                        document.querySelector("#cancelMajorErrorModification").addEventListener("click", n),
                        await new Promise((e) => (waitForPressResolve = e)),
                        document.querySelector("#confirmMajorErrorRepost").removeEventListener("click", s),
                        document.querySelector("#confirmMajorErrorDelete").removeEventListener("click", a),
                        document.querySelector("#cancelMajorErrorModification").removeEventListener("click", n),
                        document.querySelector(".global-modal").remove(),
                        o
                    );
                }
                async function b() {
                    let e = await n(["mainList", "sideList", "doneList"]);
                    null == e.mainList && (await chrome.storage.local.set({ mainList: [] })),
                        null == e.sideList && (await chrome.storage.local.set({ sideList: [] })),
                        null == e.doneList && (await chrome.storage.local.set({ doneList: [] }));
                }
                async function w() {
                    let e = await n(["doneList"]);
                    doneList = e.doneList;
                    let t = new Date().setMonth(new Date().getMonth() - 3);
                    (doneList = doneList.filter((e) => e.timestamp > t)), (doneList = doneList.slice(0, 150)), await chrome.storage.local.set({ doneList: doneList });
                }
                function M(e, t, o) {
                    let s = document.querySelector(`#${e}Content`);
                    for (let e of s.querySelectorAll(".list-item")) e.remove();
                    if ("doneList" == e) {
                        0 == t.length && (s.querySelector("#empty-done-list").classList.remove("d-none"), s.querySelector("#empty-done-list").classList.add("d-flex"));
                        for (let e of t) {
                            let t = document.querySelector("#itemTemplate").cloneNode(!0);
                            t.id = "";
                            let o = document.createElement("div");
                            o.classList.add("listTag");
                            let r = "✅",
                                a = "Traité";
                            "repostItems" == e.processName ? ((r = "♻️"), (a = "Republié")) : "saveItems" == e.processName ? ((r = "💾"), (a = "Sauvé (brouillon)")) : "postDrafts" == e.processName && ((r = "🚀"), (a = "Brouillon publié")),
                                (o.textContent = r),
                                o.classList.add("tooltip"),
                                o.classList.add("tooltip-right"),
                                o.setAttribute("data-tooltip", `${a} le : ${new Date(e.timestamp).toLocaleString(void 0, { month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: !1 })}`),
                                t.insertBefore(o, t.firstChild),
                                (t.querySelector("a").textContent = e.title),
                                e.url ? (t.querySelector("a").href = e.url) : t.querySelector("a").removeAttribute("href"),
                                e.thumbnail_url &&
                                    ((t.querySelector("img").onerror = function () {
                                        (this.onerror = null), (this.src = chrome.runtime.getURL("images/empty_placeholder.png"));
                                        let t = e;
                                        (t.thumbnail_url = chrome.runtime.getURL("images/empty_placeholder.png")), f("doneList", e.id, t);
                                    }),
                                    (t.querySelector("img").src = e.thumbnail_url)),
                                (t = v(t, e)),
                                s.appendChild(t);
                        }
                    } else {
                        "mainList" == e &&
                            (document.querySelector(`[data-list-name="${e}"].list-modify-button`).classList.remove("d-none"),
                            document.querySelector(`[data-list-name="${e}"].list-move-button`).classList.remove("d-none"),
                            document.querySelector(`[data-list-name="${e}"].list-legend-button`).classList.remove("d-none"),
                            document.querySelector(`[data-list-name="${e}"].list-back-button`).classList.add("d-none"),
                            document.querySelector(`[data-list-name="${e}"].list-delete-button`).classList.add("d-none"),
                            document.querySelector(`[data-list-name="${e}"].list-check-all-button`).classList.add("d-none"),
                            document.querySelector(`[data-list-name="${e}"].list-changelist-button`).classList.add("d-none"),
                            0 == t.length
                                ? (document.querySelector("#repost-shortcut").classList.add("d-none"), document.querySelector("#repost-shortcut").classList.remove("d-flex"))
                                : (document.querySelector("#repost-shortcut").classList.remove("d-none"), document.querySelector("#repost-shortcut").classList.add("d-flex"))),
                            (document.querySelector(`#${e}Link .itemCount`).textContent = `(${t.length})`),
                            0 == t.length
                                ? (s.querySelector(".manage-list-shortcut").classList.remove("d-none"), s.querySelector(".manage-list-shortcut").classList.add("d-flex"))
                                : (s.querySelector(".manage-list-shortcut").classList.add("d-none"), s.querySelector(".manage-list-shortcut").classList.remove("d-flex"));
                        let r = 0;
                        for (item of t) {
                            r++;
                            let t = document.querySelector("#itemTemplate").cloneNode(!0);
                            if (
                                ((t.id = ""),
                                t.querySelector(".item-checkbox").setAttribute("data-item-id", item.id),
                                t.querySelector(".item-order").setAttribute("data-item-id", item.id),
                                t.querySelector(".item-order").setAttribute("data-item-position", r - 1),
                                (t.querySelector(".item-order").value = r),
                                o && t.querySelector(".item-order").classList.remove("d-none"),
                                (t.querySelector("a").href = item.url),
                                (t.querySelector("a").textContent = item.title),
                                (t.querySelector(".image img").src = item.thumbnail_url),
                                "sideList" == e && t.querySelector(".item-checkbox").classList.remove("d-none"),
                                t.querySelector(".item-order").addEventListener("change", function () {
                                    S(this.parentNode.parentNode.id.replace("Content", ""), this.dataset.itemId, this.dataset.itemPosition, this.value - 1);
                                }),
                                null != item.error)
                            ) {
                                let e = document.createElement("div");
                                null != item.majorError ? (e.textContent = "🆘") : (e.textContent = "⚠️");
                                let o = document.createElement("div");
                                o.innerHTML = item.error;
                                let s = o.textContent || o.innerText || "";
                                e.classList.add("cursor-pointer"), e.classList.add("tooltip"), e.classList.add("tooltip-right"), e.setAttribute("data-tooltip", `${s}`), t.insertBefore(e, t.querySelector(".image"));
                            }
                            (t = v(t, item)), s.appendChild(t);
                        }
                    }
                    document.querySelectorAll("#mainListContent .list-item").length > 0 && (document.querySelector("#repost-shortcut").classList.remove("d-none"), document.querySelector("#repost-shortcut").classList.add("d-flex"));
                }
                function v(e, t) {
                    if (t.full_data && s(t.full_data, "user")) {
                        let t = document.createElement("div");
                        t.classList.add("listTag"),
                            (t.textContent = "📛"),
                            t.classList.add("tooltip"),
                            t.classList.add("tooltip-left"),
                            t.setAttribute("data-tooltip", "Changer la catégorie avant de republier.\n Sinon Vinted va le redescendre"),
                            e.appendChild(t);
                    }
                    if (1 == t.is_draft) {
                        let t = document.createElement("div");
                        t.classList.add("listTag"), (t.textContent = "B"), t.classList.add("draft-color"), t.classList.add("tooltip"), t.classList.add("tooltip-left"), t.setAttribute("data-tooltip", "Brouillon"), e.appendChild(t);
                    } else if (1 != t.can_be_sold) {
                        let t = document.createElement("div");
                        t.classList.add("listTag"), (t.textContent = "V"), t.classList.add("sold-color"), t.classList.add("tooltip"), t.classList.add("tooltip-left"), t.setAttribute("data-tooltip", "Article \n vendu"), e.appendChild(t);
                    } else if (1 == t.is_reserved) {
                        let t = document.createElement("div");
                        t.classList.add("listTag"), (t.textContent = "R"), t.classList.add("reserved-color"), t.classList.add("tooltip"), t.classList.add("tooltip-left"), t.setAttribute("data-tooltip", "Article réservé"), e.appendChild(t);
                    } else if (1 == t.is_hidden) {
                        let t = document.createElement("div");
                        t.classList.add("listTag"), (t.textContent = "M"), t.classList.add("hidden-color"), t.classList.add("tooltip"), t.classList.add("tooltip-left"), t.setAttribute("data-tooltip", "Article \n masqué"), e.appendChild(t);
                    }
                    if (t.promoted) {
                        let t = document.createElement("div");
                        t.classList.add("listTag"), (t.textContent = "⏫"), t.classList.add("tooltip"), t.classList.add("tooltip-left"), t.setAttribute("data-tooltip", "Article \n Boosté"), e.appendChild(t);
                    }
                    return e;
                }
                async function y(e) {
                    let t = await n(["mainList", "sideList"]),
                        o = ["mainList", "sideList"].filter((t) => t != e)[0],
                        s = t[e],
                        r = t[o],
                        a = document.querySelector(`#${e}Content`).querySelectorAll("input[type=checkbox]:checked");
                    if (0 != a.length) {
                        for (item of a) {
                            let e = item.dataset.itemId;
                            (itemToMove = s.find((t) => t.id == e)), (s = s.filter((e) => e.id != itemToMove.id)), (r = r.filter((e) => e.id != itemToMove.id)), r.push(itemToMove);
                        }
                        M(o, r), M(e, s), await chrome.storage.local.set({ [e]: s, [o]: r }), chrome.storage.local.set({ globalUiMessage: { content: "Les articles ont été déplacés vers l'autre liste", type: "success", time: 2e3 } });
                    } else chrome.storage.local.set({ globalUiMessage: { content: "Sélectionnez des articles pour les changer de liste", type: "warning", time: 2e3 } });
                }
                async function U(e) {
                    if (confirm("🛑 Es-tu 100% CERTAIN de vouloir vider la liste ? 🛑")) {
                        g(
                            e,
                            (await n([e]))[e].map((e) => e.id),
                            !0
                        );
                    }
                }
                async function S(e, t, o, s) {
                    let r = (await n([e]))[e];
                    r.splice(s, 0, r.splice(o, 1)[0]),
                        await chrome.storage.local.set({ [e]: r }),
                        M(e, r, (showListOrder = !0)),
                        chrome.storage.local.set({ globalUiMessage: { content: "Articles réorganisés", type: "success", time: 2e3 } });
                }
                t.exports = {
                    fe: async function (e) {
                        await b(), chrome.storage.local.set({ activityUid: "" });
                        let t = await n([e, "userInfo"]),
                            o = t[e],
                            s = t.userInfo,
                            r = Array.prototype.slice.call(document.getElementsByClassName("vinz-selected"));
                        if (0 == r.length) return void chrome.storage.local.set({ globalUiMessage: { content: "Aucun article sélectionné", type: "warning", time: 2e3 } });
                        chrome.storage.local.set({
                            progressUiMessage: {
                                currentIndex: 1,
                                totalIndex: 4,
                                stage: "Clemz regarde ta sélection",
                                articleName: "Ajouter des articles à une liste",
                                articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                showLoader: !0,
                            },
                        });
                        let a = r.map(function (e) {
                                return e.getAttribute("articleId");
                            }),
                            i = new Set(),
                            c = 0;
                        for (let t of a) {
                            let r;
                            c++,
                                chrome.storage.local.set({
                                    progressUiMessage: {
                                        currentIndex: c,
                                        totalIndex: a.length,
                                        stage: "Clemz vérifie chaque article...",
                                        articleName: `Ajouter ${a.length} articles à une liste`,
                                        articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                        showLoader: !0,
                                    },
                                });
                            try {
                                r = await m(t, "", (showProgressUiError = !1), (retryOn404 = !1), "MLS-FA", null, (functionCallNumber = 0));
                            } catch (e) {
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "Erreur de Clemz en récupérant un article (erreur MLS-FA)",
                                    showUiMessage: !1,
                                    devMessage: "MLS-FA - code",
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !1,
                                }),
                                    (r = { errorMessage: !0 });
                            }
                            if (null != r.errorMessage) {
                                i.add("- article impossible à récupérer");
                                continue;
                            }
                            if (null == r.item.photos[0]) {
                                i.add("- article sans photo");
                                continue;
                            }
                            let n = new Set();
                            if ((o.forEach((e) => n.add(e.id)), n.size == n.add(r.item.id).size)) {
                                i.add("- article déjà présent dans la liste");
                                continue;
                            }
                            let l = "";
                            if (("" != s.profileUrl && (l = s.profileUrl.split("-")[0]), r.item.user_id != l && "admin" != s.role && "" != l)) {
                                i.add("- article qui n'est pas de ton dressing");
                                continue;
                            }
                            let u = p(r);
                            if (((o = o.concat([u])), (smartDressingArticle = document.querySelector(`[data-item-id='${u.id}'`)), smartDressingArticle)) {
                                let t = smartDressingArticle.querySelector(".top-right-icons span").textContent;
                                "mainList" == e ? (t = `📥${t}`) : "sideList" == e && (t = `📦${t}`), (smartDressingArticle.querySelector(".top-right-icons span").textContent = t);
                            }
                            try {
                                await chrome.storage.local.set({ [e]: o });
                            } catch (e) {
                                return void chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "<b>Erreur de mémoire</b><br>Mémoire saturée : mettez moins d'articles dans vos listes. Si besoin videz vos listes et réessayez.",
                                    showUiMessage: !0,
                                    devMessage: "MLS-storage",
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !0,
                                });
                            }
                        }
                        if (
                            (chrome.storage.local.set({
                                progressUiMessage: {
                                    currentIndex: a.length,
                                    totalIndex: a.length,
                                    stage: "Ajout à la liste terminé",
                                    articleName: "J'ai fait le boulot ! 🦾",
                                    articleImageUrl: chrome.runtime.getURL("images/bot_celebration.png"),
                                    showLoader: !1,
                                    processFinishedButton: "showLists",
                                },
                            }),
                            i.size > 0)
                        ) {
                            let e = "<b>Un article ou + n'a pas été ajouté car :</b>";
                            i.forEach((t) => (e = `${e} <br> ${t}`)), chrome.storage.local.set({ globalUiMessage: { content: e, type: "warning" } });
                        }
                        document.querySelectorAll(".vinz-selected").forEach(function (t) {
                            t.parentNode.querySelector(`.belongs-to-${e}`) &&
                                ("mainList" == e && (t.parentNode.querySelector(`.belongs-to-${e}`).textContent = "📥"), "sideList" == e && (t.parentNode.querySelector(`.belongs-to-${e}`).textContent = "📦")),
                                t.classList.remove("vinz-selected"),
                                t.classList.add("vinz-waiting");
                        });
                    },
                    he: async function () {
                        await b(), await w();
                        let e = await n(["mainList", "sideList", "doneList"]),
                            t = e.mainList,
                            o = e.sideList,
                            s = e.doneList;
                        fetch(chrome.runtime.getURL("html/toolModals/listsModal.html"))
                            .then((e) => e.text())
                            .then((e) => {
                                a(e, "listsModal"), M("mainList", t), M("sideList", o), M("doneList", s);
                                let r = document.querySelectorAll("[data-open-tab]");
                                for (let e of r)
                                    "listsModal" == e.dataset.openTabContainer &&
                                        e.addEventListener("click", function () {
                                            (linkName = e.dataset.openTab), (containerName = e.dataset.openTabContainer), i(containerName, linkName);
                                        });
                                document.querySelector("#repost-shortcut").addEventListener("click", function () {
                                    document.querySelector("#listsModal").remove(), document.querySelector("#repostTabLink").click();
                                });
                                let n = document.querySelectorAll(".manage-list-shortcut .btn");
                                for (let e of n)
                                    e.addEventListener("click", function () {
                                        document.querySelector("#listsModal").remove(), document.querySelector("#listsTabLink").click();
                                    });
                                let c = document.querySelector(".list-modify-button"),
                                    l = c.dataset.listName;
                                c.addEventListener("click", function () {
                                    document.querySelector(`[data-list-name="${l}"].list-delete-button`).classList.remove("d-none"),
                                        document.querySelector(`[data-list-name="${l}"].list-check-all-button`).classList.remove("d-none"),
                                        document.querySelector(`[data-list-name="${l}"].list-back-button`).classList.remove("d-none"),
                                        document.querySelector(`[data-list-name="${l}"].list-changelist-button`).classList.remove("d-none"),
                                        document.querySelector(`[data-list-name="${l}"].list-move-button`).classList.add("d-none"),
                                        document.querySelector(`[data-list-name="${l}"].list-legend-button`).classList.add("d-none"),
                                        this.classList.add("d-none");
                                    let e = document.querySelectorAll(`#${l}Content input`);
                                    for (input of e) input.classList.contains("item-checkbox") && input.classList.remove("d-none"), input.classList.contains("item-order") && input.classList.add("d-none");
                                }),
                                    document.querySelector(".list-back-button").addEventListener("click", function () {
                                        document.querySelector(`[data-list-name="${l}"].list-delete-button`).classList.add("d-none"),
                                            document.querySelector(`[data-list-name="${l}"].list-check-all-button`).classList.add("d-none"),
                                            document.querySelector(`[data-list-name="${l}"].list-changelist-button`).classList.add("d-none"),
                                            document.querySelector(`[data-list-name="${l}"].list-modify-button`).classList.remove("d-none"),
                                            document.querySelector(`[data-list-name="${l}"].list-move-button`).classList.remove("d-none"),
                                            document.querySelector(`[data-list-name="${l}"].list-legend-button`).classList.remove("d-none"),
                                            this.classList.add("d-none");
                                        let e = document.querySelectorAll(`#${l}Content input`);
                                        for (input of e) input.classList.contains("item-checkbox") && input.classList.add("d-none");
                                    }),
                                    document.querySelector(`[data-list-name="${l}"].list-legend-button`).addEventListener("click", function () {
                                        fetch(chrome.runtime.getURL("html/toolModals/listsLegendModal.html"))
                                            .then((e) => e.text())
                                            .then((e) => {
                                                document.querySelector("#toolBody").insertAdjacentHTML("afterbegin", e);
                                            });
                                    });
                                let u = document.querySelectorAll(".list-check-all-button");
                                for (button of u) {
                                    let e = button.dataset.listName;
                                    button.addEventListener("click", function () {
                                        let t = document.querySelectorAll(`#${e}Content input`);
                                        for (input of t) input.checked = this.checked;
                                    });
                                }
                                let d = document.querySelectorAll(".list-delete-button");
                                for (button of d) {
                                    let e = button.dataset.listName;
                                    button.addEventListener("click", function () {
                                        let t = document.querySelector(`#${e}Content`).querySelectorAll("input[type=checkbox]:checked"),
                                            o = [];
                                        if (0 != t.length) {
                                            for (element of t) {
                                                let e = element.dataset.itemId;
                                                o.push(e);
                                            }
                                            g(e, o, !0);
                                        } else chrome.storage.local.set({ globalUiMessage: { content: "Sélectionnez des articles pour les supprimer", type: "warning", time: 2e3 } });
                                    });
                                }
                                let m = document.querySelectorAll(".list-changelist-button");
                                for (button of m) {
                                    let e = button.dataset.listName;
                                    button.addEventListener("click", function () {
                                        y(e);
                                    });
                                }
                                let p = document.querySelectorAll(".list-empty-button");
                                for (button of p) {
                                    let e = button.dataset.listName;
                                    button.addEventListener("click", function () {
                                        U(e);
                                    });
                                }
                                let f = document.querySelectorAll(".list-move-button");
                                for (button of f) {
                                    let e = button.dataset.listName;
                                    button.addEventListener("click", function () {
                                        const t = document.querySelectorAll(`#${e}Content .list-item .item-order`);
                                        document.querySelector(`#${e}Content .list-item .item-order.d-none`) &&
                                            chrome.storage.local.set({ globalUiMessage: { content: "Pour déplacer un article, changez le numéro à sa gauche (=sa place dans la liste)", type: "warning", time: 5e3 } });
                                        for (let e of t) e.classList.toggle("d-none");
                                    });
                                }
                                window.addEventListener(
                                    "keydown",
                                    function (e) {
                                        ("Escape" == e.key) | (27 == e.keyCode) && "BODY" == e.target.nodeName && (e.preventDefault(), document.querySelector("#listsModal") && document.querySelector("#listsModal").remove());
                                    },
                                    { once: !0 }
                                );
                            });
                    },
                    xe: async function (e, t, o, s, r) {
                        let a = (await n(["mainList"])).mainList,
                            i = e;
                        if (!i.majorError)
                            if (((i.error = t), (i.majorError = s), (i.actionAfterMajorError = r), o)) f("mainList", e.id, i);
                            else {
                                let t = a.length;
                                (a = a.filter((t) => t.id != e.id)), t > a.length && (a.push(i), await chrome.storage.local.set({ mainList: a }));
                            }
                    },
                    Ie: g,
                    Ae: p,
                    ke: h,
                    Ne: f,
                };
            },
            { "./apiCalls.js": 1, "./utilities.js": 12 },
        ],
        7: [
            function (e, t, o) {
                const { t: s, o: r, Oe: a, i: n, te: i, K: c, Se: l, ee: u } = e("./utilities.js"),
                    { u: d, g: m, p: g, h: p, M: f, v: h, U: b, C: w, R: M, T: v, j: y, B: U, q: S } = e("./apiCalls.js"),
                    { xe: x, Ie: I, Ae: A, ke: k, Ne: N } = e("./manageListsScript.js");
                async function O(e, t, o, r, a, n, i) {
                    const c = window.location.hostname;
                    o.email;
                    let l,
                        u = o.activeLogs,
                        d = `repostOnebyOne=${r} - quickRepostMode=${i} - addViews=${a} - maxViewsSelected=${n} - userInfoActiveLogs=${u}`,
                        w = { listed: t.map((e) => ({ id: e.id, title: e.title })) };
                    try {
                        l = await M(t.length, e, d, w);
                    } catch (e) {
                        return void chrome.runtime.sendMessage({
                            message: "error",
                            origin: "code",
                            uiMessage: "Erreur de com avec clemz.app (erreur RAS-CA1)",
                            devMessage: "RAS-CA1 - code",
                            backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                        });
                    }
                    if ("success" != l.message) return;
                    const S = l.activityUid;
                    chrome.storage.local.set({
                        progressUiMessage: { currentIndex: 0, totalIndex: t.length, stage: "Clemz se met au boulot...", articleName: "", articleImageUrl: chrome.runtime.getURL("images/bot_screen.png"), showLoader: !0 },
                    });
                    let A = 0;
                    for (const [o, r] of t.entries()) {
                        await y(
                            "brJmF7jTPgQkEhlFWD/EOo+pGapF+YBzWaujhwII/m2YLyCKghxEG3oLeA==--COfF13i6fEkJ6SIQ--HeAsh31xTyti56zktdH07w==",
                            `${JSON.stringify(r.full_data)}`,
                            "GXhrOEbrljprYQ==--+YwvPNE0G/4z9H1g--RuRfh1PRg4KhpvcSbqAejQ==",
                            S
                        ),
                            await L("1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==", r.title, "tyAmRkP58AowK3qUSBpl+VS3qH+p9oJtfw/AYQg=--87e+3PXJ9WpjwuNY--4PVAUZCtIA+4/KzeMwfGZw==", S);
                        let l = { currentIndex: o, totalIndex: t.length, stage: "préparation des photos", articleName: r.title, articleImageUrl: r.thumbnail_url, showLoader: !0 };
                        chrome.storage.local.set({ progressUiMessage: l });
                        let d = [];
                        if (i && r.can_be_sold);
                        else {
                            let e,
                                t = [];
                            for (photoObject of r.full_data.photos) t.push(photoObject.full_size_url);
                            try {
                                e = await U(t, l, "RAS-FPVP1", S, (functionCallNumber = 0));
                            } catch (t) {
                                (errorMessage = `<b>Perte de connexion avec Vinted</b> en récupérant les photos de l'article "${r.title.slice(0, 30)}"`),
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: "",
                                        showUiMessage: !1,
                                        devMessage: `RAS-FPVP1- code - ${r.title}`,
                                        backtrace: JSON.stringify(t, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                    (e = { errorMessage: errorMessage, error: JSON.stringify(t, ["message", "arguments", "type", "name"]) });
                            }
                            if (null != e.errorMessage) {
                                y(
                                    "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                    `${r.title} - ${JSON.stringify(e)}`,
                                    "b4KJgaCD9s/pJ0T0NsNcduDTSytPv9BdhXiA0fY2K8InnUpvB6kM--RcN9IQfDiAuHRssl--Kfv5JmjYrA/2jHFnTJwqHA==",
                                    S
                                ),
                                    x(r, "Bug en lisant une photo de l'ancienne annonce. Réessaye"),
                                    1 == e.errorMessage && (e.errorMessage = `<b>Erreur de lecture d'une photo</b> sur l'article "${r.title.slice(0, 30)}"`),
                                    chrome.storage.local.set({ globalUiMessage: { content: e.errorMessage, type: "warning" } });
                                continue;
                            }
                            await L(
                                "1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==",
                                r.title,
                                "HR12yE1n5WGcj1kSjcllo/ioetu68hCXLKue0dLvYKYJm9vmrdrIxS9b0fbvsMcMjp8df2Vv--zj2ZS97lSXUig5gK--4zX7DiQVADHdafYGiuyGPg==",
                                S
                            );
                            try {
                                d = await g(e, l, "RAS-PP1", S, u, (functionCallNumber = 0));
                            } catch (e) {
                                (errorMessage = `<b>Perte de connexion avec Vinted</b> en envoyant les photos de l'article "${r.title.slice(0, 30)}"`),
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: "",
                                        showUiMessage: !1,
                                        devMessage: `RAS-PP1 - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                    (d = { errorMessage: errorMessage });
                            }
                            if (null != d.errorMessage) {
                                y(
                                    "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                    `${r.title} - ${JSON.stringify(d)}`,
                                    "NNfr9c/QwRj71rpZs7B5WXEdN4es7naKD/qBFeVSqXaZIhqbs35YNQ==--so9WmbZd6MZF8DJt--gPT9DOt2psm5jeWD+OWyHA==",
                                    S
                                ),
                                    x(r, "Bug en lisant une photo de l'ancienne annonce. Réessaye"),
                                    1 == d.errorMessage && (d.errorMessage = `<b>Erreur de Vinted en lisant une photo</b> sur l'article "${r.title.slice(0, 30)}"<br>${d.errorAdditionalInfo}`),
                                    chrome.storage.local.set({ globalUiMessage: { content: d.errorMessage, type: "warning" } });
                                continue;
                            }
                        }
                        const w = await C(r.full_data);
                        await L("1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==", r.title, "/VaaC00cSZc7xBBdWGYFvkSoimLX2cFcaZFJNHdOIqmdgf7mBhvphmI=--3bYHk22UDK6LBtQg--j42KT67lqufiL2/Qi+BsIg==", S),
                            chrome.storage.local.set({ progressUiMessage: { currentIndex: o, totalIndex: t.length, stage: "création d'un brouillon", articleName: r.title, articleImageUrl: r.thumbnail_url, showLoader: !0 } });
                        try {
                            postDraftResponse = await p(w, d, (postDraft = !0), S, u, (functionCallNumber = 0));
                        } catch (e) {
                            (errorMessage = `<b>Perte de connexion avec Vinted<b> en créant le brouillon de "${r.title.slice(0, 30)}"`),
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "",
                                    showUiMessage: !1,
                                    devMessage: `RAS-PA - code - ${r.title}`,
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !1,
                                }),
                                (postDraftResponse = { errorMessage: errorMessage });
                        }
                        if (null != postDraftResponse.errorMessage) {
                            y(
                                "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                `${r.title} - ${JSON.stringify(postDraftResponse)}`,
                                "BwSue2gmYX9KSG4bODoYoXJtp9vmwD5f738EORs/a5ecKbXOxfT2cto=--zbABYX5FgGQNmZK9--bP4m3n9FiJspJkKJHZr8Hw==",
                                S
                            ),
                                (errorAdditionalInfo = "Réessaye"),
                                postDraftResponse.errorAdditionalInfo && (errorAdditionalInfo = postDraftResponse.errorAdditionalInfo),
                                x(r, `Erreur en créant le brouillon. ${errorAdditionalInfo}`),
                                chrome.storage.local.set({ globalUiMessage: { content: postDraftResponse.errorMessage, type: "warning" } });
                            continue;
                        }
                        let M,
                            k,
                            N = postDraftResponse.draft;
                        if (
                            (await L(
                                "1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==",
                                r.title,
                                "nSAVpG/5fEWmpI3eufTQ/Blyj38QmCurd33jeCNovV0P+WxvTQhdFXmm--yVfhOsnkubxe1GCf--K41TIuJ3W40M7k/AfFamDA==",
                                S
                            ),
                            r.can_be_sold)
                        ) {
                            chrome.storage.local.set({ progressUiMessage: { currentIndex: o, totalIndex: t.length, stage: "suppression de l'ancien article", articleName: r.title, articleImageUrl: r.thumbnail_url, showLoader: !0 } }),
                                (placeHolderPhotoResponse = await fetch(chrome.runtime.getURL("images/delete_placeholder.png"))),
                                (placeholderPhotoBlob = await placeHolderPhotoResponse.blob()),
                                (placeholderPhotoBlobArray = [placeholderPhotoBlob]);
                            try {
                                placeholderPhotoIdArray = await g(placeholderPhotoBlobArray, null, "RAS-PP2", S, u, (functionCallNumber = 0));
                            } catch (e) {
                                (errorMessage = `<b>Perte de connexion avec Vinted</b> en supprimant l'ancienne annonce "${r.title.slice(0, 30)}"`),
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: "",
                                        showUiMessage: !1,
                                        devMessage: `RAS-PP2 - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                    (placeholderPhotoIdArray = { errorMessage: errorMessage });
                            }
                            if (null != placeholderPhotoIdArray.errorMessage) {
                                if (
                                    (y(
                                        "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                        `${r.title} - ${JSON.stringify(placeholderPhotoIdArray)}`,
                                        "s4+BNjVPk/8dlymjjvbAbSGcxPsz71tGpPgcoi83Zecj+9okxqyb5w==--U8HnEp70FZ1VhkGj--jRMWDKCaIk9wpYvu5Mop8Q==",
                                        S
                                    ),
                                    1 == placeholderPhotoIdArray.errorMessage && (placeholderPhotoIdArray.errorMessage = `<b>Erreur de suppression de Vinted</b> sur l'article "${r.title.slice(0, 30)}"`),
                                    (rescueByDeletingNewDraftResponse = await E(N, S, u)),
                                    "success" == rescueByDeletingNewDraftResponse)
                                ) {
                                    y(
                                        "Yo4v6ftVFGc3Ii4N3NVNclJ2huCANPAbKDihHevrq1OxeOA542ZRL/QELm0+FoE=--1mJgKRIkKaXhne/5--/BtBHXMR9HqhNtWSWatYzQ==",
                                        r.title,
                                        "4c97UsLeZZYYPam0usljt3bL/65rb8MrB70gfO6SB0mwyiI=--LgVh3ZH0SfVJ9S/J--WoO6D1JpKePeuSdRndl8Hw==",
                                        S
                                    ),
                                        x(r, "Erreur en supprimant l'ancienne annonce. Réessaye."),
                                        chrome.storage.local.set({ globalUiMessage: { content: placeholderPhotoIdArray.errorMessage, type: "warning" } });
                                    continue;
                                }
                                return (
                                    y(
                                        "Za9R31b2RERsXxyy5RFWtv59KX6z6llM1IqWoFmLkPP4JrtmSQ==--qmioKKVshrc5vRyQ--R1nEg4v78nBC7kUVeCVuEQ==",
                                        r.title,
                                        "4c97UsLeZZYYPam0usljt3bL/65rb8MrB70gfO6SB0mwyiI=--LgVh3ZH0SfVJ9S/J--WoO6D1JpKePeuSdRndl8Hw==",
                                        S
                                    ),
                                    x(r, "Erreur en supprimant l'ancienne annonce. Un brouillon en trop a été créé: supprime-le de ton dressing.", (putAtSamePosition = !0), (majorError = !0), (actionAfterMajorError = "repost")),
                                    chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: o,
                                            totalIndex: t.length,
                                            articleName: "XX ERREUR de suppression XX",
                                            stage: `Un brouillon en trop a été créé pour "${r.title.slice(0, 30)}" : supprime-le de ton dressing.`,
                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                            showLoader: !1,
                                            processFinishedButton: "dressing",
                                        },
                                        globalUiMessage: { content: `<b>Erreur de suppression - Vérifies ton dressing</b><br>Un brouillon a été créé pour "${r.title.slice(0, 30)}" : supprime-le de ton dressing.`, type: "danger" },
                                    }),
                                    void (await chrome.storage.local.remove(["storedLog"]))
                                );
                            }
                        }
                        if (
                            (await L(
                                "1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==",
                                r.title,
                                "c65+f3Go1g65XPOjQg9WClzx1xTBt8BGdcNABGW1VX5SKZeffPUIJuhxTwSp--V+jA/zE1Hvw4mFOF--K7SerlkYjFdozwhssLM2+Q==",
                                S
                            ),
                            r.can_be_sold)
                        ) {
                            (w.assigned_photos = []), w.assigned_photos.push({ id: placeholderPhotoIdArray[0], orientation: 0 }), w.price > 100 && (w.price = 90);
                            try {
                                (articleType = "item"), "postDrafts" == e && (articleType = "draft"), (updateOldArticleResponse = await f(w, articleType, r.id, "RAS-UA1", S, u, (functionCallNumber = 0)));
                            } catch (e) {
                                (errorMessage = `<b>Perte de connexion avec Vinted</b> en supprimant l'ancienne annonce "${r.title.slice(0, 30)}"`),
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: errorMessage,
                                        showUiMessage: !1,
                                        devMessage: `RAS-UA1 - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                    (updateOldArticleResponse = { errorMessage: errorMessage, message: e.message, arguments: e.arguments, type: e.type, name: e.name });
                            }
                            if (null != updateOldArticleResponse.errorMessage) {
                                if (
                                    (y(
                                        "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                        `${r.title} - ${JSON.stringify(updateOldArticleResponse)}`,
                                        "ngSdEBjcG+dyDQpRyGOp94yXYwRj5iMMEchbyUg2+PaFCF68ysG8CBLGRw==--g3xpqIt5Cw0bg0TS--QyqFehtv+Jnx4GpP+SwWvA==",
                                        S
                                    ),
                                    1 == updateOldArticleResponse.errorMessage &&
                                        (updateOldArticleResponse.errorMessage = `<b>Erreur de suppression de Vinted</b> sur l'article "${r.title.slice(0, 30)}"<br>${updateOldArticleResponse.errorAdditionalInfo}`),
                                    (rescueByDeletingNewDraftResponse = await E(N, S, u)),
                                    "success" == rescueByDeletingNewDraftResponse)
                                ) {
                                    y(
                                        "Yo4v6ftVFGc3Ii4N3NVNclJ2huCANPAbKDihHevrq1OxeOA542ZRL/QELm0+FoE=--1mJgKRIkKaXhne/5--/BtBHXMR9HqhNtWSWatYzQ==",
                                        r.title,
                                        "SAd9D1sbjxK8/NCWrfiUuuKKtQpRBmJxUi1OaX+ZqrFne+w=--UsbYmxwuLrn5JQr+--XK+w8IkbudasVlBp4hqTOw==",
                                        S
                                    );
                                    let e = "";
                                    updateOldArticleResponse.errorAdditionalInfo && (e = ` (${updateOldArticleResponse.errorAdditionalInfo})`),
                                        x(r, `Erreur avec l'ancienne annonce${e}. Réessaye.`),
                                        chrome.storage.local.set({ globalUiMessage: { content: updateOldArticleResponse.errorMessage, type: "warning" } });
                                    continue;
                                }
                                return (
                                    y(
                                        "Za9R31b2RERsXxyy5RFWtv59KX6z6llM1IqWoFmLkPP4JrtmSQ==--qmioKKVshrc5vRyQ--R1nEg4v78nBC7kUVeCVuEQ==",
                                        r.title,
                                        "SAd9D1sbjxK8/NCWrfiUuuKKtQpRBmJxUi1OaX+ZqrFne+w=--UsbYmxwuLrn5JQr+--XK+w8IkbudasVlBp4hqTOw==",
                                        S
                                    ),
                                    x(r, "Erreur en supprimant l'ancienne annonce. Un brouillon en trop a été créé: supprime-le de ton dressing.", (putAtSamePosition = !0), (majorError = !0), (actionAfterMajorError = "repost")),
                                    chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: o,
                                            totalIndex: t.length,
                                            articleName: "XX ERREUR de suppression XX",
                                            stage: `Un brouillon en trop a été créé pour "${r.title.slice(0, 30)}" : supprime-le de ton dressing.`,
                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                            showLoader: !1,
                                            processFinishedButton: "dressing",
                                        },
                                        globalUiMessage: { content: `<b>Erreur de suppression - Vérifies ton dressing</b><br>Un brouillon a été créé pour "${r.title.slice(0, 30)}" : supprime-le de ton dressing.`, type: "danger" },
                                    }),
                                    void (await chrome.storage.local.remove(["storedLog"]))
                                );
                            }
                        }
                        if (
                            (await L(
                                "1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==",
                                r.title,
                                "Bokqg7KVVk2vXODwUpjKGyAzLdsZDbMs4AT58LCcQc3IJc3B40WHeE8uOuVkSNLvcWS+bY9uoqA=--5ArvE1Bwu/6q76aW--dsJ8NmuKCHq7Ssw+te5CVw==",
                                S
                            ),
                            i)
                        ) {
                            let e = await C(N);
                            for (photoObject of ((e.assigned_photos = []), r.full_data.photos)) e.assigned_photos.push({ id: photoObject.id, orientation: 0 });
                            try {
                                quickModeAttachPhotosResponse = await f(e, "draft", e.id, "RAS-UA2", S, u, (functionCallNumber = 0));
                            } catch (e) {
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "",
                                    showUiMessage: !1,
                                    devMessage: `RAS-UA2 - code - ${r.title}`,
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !1,
                                }),
                                    (quickModeAttachPhotosResponse = { errorMessage: !0 });
                            }
                            null != quickModeAttachPhotosResponse.errorMessage &&
                                y(
                                    "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                    `${r.title} - ${JSON.stringify(quickModeAttachPhotosResponse)}`,
                                    "pPPBm+T4BeYIeS8hJZl7mTuDSAFnSV0TEN4goEIxLZes2+tL7X9qg75EWg==--MwTqVwgOF7jntAu9--bejLKbyH7oNzVm1MfOalVQ==",
                                    S
                                );
                        }
                        if (
                            (await L("1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==", r.title, "AhHMEi35plVViC08034fNp6j3AJ/XSyDFbFjQ4O3x9uI+gsp--ERRNGhqjwIm2nSXP--Q5Pkjrgc9xRPyGI+gwdyfQ==", S),
                            r.can_be_sold)
                        ) {
                            try {
                                deleteArticleResponse = await h(r.id, r.title, "RAS-DA", S, u, (functionCallNumber = 0));
                            } catch (e) {
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "",
                                    showUiMessage: !1,
                                    devMessage: `RAS-DA - code - ${r.title}`,
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !1,
                                }),
                                    (deleteArticleResponse = { errorMessage: !0 });
                            }
                            if (null != deleteArticleResponse.errorMessage) {
                                y(
                                    "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                    `${r.title} - ${JSON.stringify(deleteArticleResponse)}`,
                                    "wuQTdyg6M+esfqBsEsNnmJgoYj39frmSly/aCYzCiX6b--oSzepNcyIgvywN45--9zaBZZGq/gI3oLPswRZc2w==",
                                    S
                                );
                                const s = await C(N);
                                if (((newPhotosIdsArray = []), i)) for (photoObject of r.full_data.photos) newPhotosIdsArray.push(photoObject.id);
                                else for (let e of s.photos) newPhotosIdsArray.push(e.id);
                                return (
                                    (rescueResponse = "saveItems" != e ? await R(s, newPhotosIdsArray, S, u) : "success"),
                                    "success" == rescueResponse
                                        ? (y(
                                              "Yo4v6ftVFGc3Ii4N3NVNclJ2huCANPAbKDihHevrq1OxeOA542ZRL/QELm0+FoE=--1mJgKRIkKaXhne/5--/BtBHXMR9HqhNtWSWatYzQ==",
                                              r.title,
                                              "nJDFvriRXh4o4NC0nxsL/MG76nfGTdGT3UewL9K99syVa3y9--9o9/X4D0sXt9vzGv--U5NUqyxiJkjOK8GhV7o+5g==",
                                              S
                                          ),
                                          x(r, "Erreur avec l'ancienne annonce. Elle n'a pas été supprimée (photo noire) : supprime-la de ton dressing.", (putAtSamePosition = !0), (majorError = !0), (actionAfterMajorError = "delete")),
                                          chrome.storage.local.set({
                                              progressUiMessage: {
                                                  currentIndex: o,
                                                  totalIndex: t.length,
                                                  articleName: "XX ERREUR de suppression XX",
                                                  stage: `Ancienne annonce "${r.title.slice(0, 30)}" non supprimée (photo noire) : à faire à la main.`,
                                                  articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                  showLoader: !1,
                                                  processFinishedButton: "dressing",
                                              },
                                              globalUiMessage: {
                                                  content: `<b>Erreur de suppression - Vérifies ton dressing</b><br>Ancienne annonce "${r.title.slice(0, 30)}" non supprimée (photo noire) : à faire à la main.`,
                                                  type: "danger",
                                              },
                                          }),
                                          void (await chrome.storage.local.remove(["storedLog"])))
                                        : (y(
                                              "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                              r.title,
                                              "nJDFvriRXh4o4NC0nxsL/MG76nfGTdGT3UewL9K99syVa3y9--9o9/X4D0sXt9vzGv--U5NUqyxiJkjOK8GhV7o+5g==",
                                              S
                                          ),
                                          x(r, "Ancienne annonce non supprimée (photo noire) et nouvelle annonce en brouillon : vérifies ton dressing.", (putAtSamePosition = !0), (majorError = !0), (actionAfterMajorError = "delete")),
                                          chrome.storage.local.set({
                                              progressUiMessage: {
                                                  currentIndex: o,
                                                  totalIndex: t.length,
                                                  articleName: "XX ERREURS multiples XX",
                                                  stage: `Vérifies ton dressing: Ancienne annonce "${r.title.slice(0, 30)}" non supprimée (photo noire) et nouvelle annonce en brouillon.`,
                                                  articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                  showLoader: !1,
                                                  processFinishedButton: "dressing",
                                              },
                                              globalUiMessage: { content: `<b>Erreurs - Vérifies ton dressing</b><br>Ancienne annonce "${r.title.slice(0, 30)}" non supprimée (photo noire) et nouvelle annonce en brouillon`, type: "danger" },
                                          }),
                                          void (await chrome.storage.local.remove(["storedLog"])))
                                );
                            }
                        }
                        if (
                            (await L(
                                "1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==",
                                r.title,
                                "ym2l8gTPqbYiuLWOvID2PxgBVEj3oSR8ZMwYWSYeNf45kZ90T89XTBz3ryfV2w==--1AMaqbG/s5z6Rd4l--bbZyy0lG4cQRsI1LMSn6SQ==",
                                S
                            ),
                            "saveItems" != e)
                        ) {
                            chrome.storage.local.set({ progressUiMessage: { currentIndex: o, totalIndex: t.length, stage: "publication de la copie", articleName: r.title, articleImageUrl: r.thumbnail_url, showLoader: !0 } });
                            const e = await C(N);
                            if (((newPhotosIdsArray = []), i)) for (photoObject of r.full_data.photos) newPhotosIdsArray.push(photoObject.id);
                            else for (let t of e.photos) newPhotosIdsArray.push(t.id);
                            try {
                                submitDraftResponse = await b(e, newPhotosIdsArray, "RAS-SD", S, u, (functionCallNumber = 0));
                            } catch (e) {
                                (errorMessage = `<b>Perte de connexion avec Vinted</b> en publiant la nouvelle annonce "${r.title.slice(0, 30)}" : publie le brouillon à la main`),
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: errorMessage,
                                        showUiMessage: !1,
                                        devMessage: `RAS-SD - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                    (submitDraftResponse = { errorMessage: errorMessage });
                            }
                            if (null != submitDraftResponse.errorMessage)
                                return (
                                    y(
                                        "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                        `${r.title} - ${JSON.stringify(submitDraftResponse)}`,
                                        "rB4oaf+JaOE9AySOy7RFKhnXj5GgDvZPX712aQBNmA==--i0vPUEI6Rek0gKKu--PfZSdYO+WkXm/sEhG6xhXw==",
                                        S
                                    ),
                                    x(r, "Erreur en publiant la nouvelle annonce : elle est en brouillon. Publie-la manuellement", (putAtSamePosition = !0), (majorError = !0), (actionAfterMajorError = "delete")),
                                    chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: o,
                                            totalIndex: t.length,
                                            articleName: "XX ERREUR en publiant XX",
                                            stage: `Le brouillon de la nouvelle annonce "${r.title.slice(0, 30)}" n'a pas pu être publié.  Fais-le manuellement`,
                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                            showLoader: !1,
                                            processFinishedButton: "dressing",
                                        },
                                        globalUiMessage: { content: submitDraftResponse.errorMessage, type: "danger" },
                                    }),
                                    void (await chrome.storage.local.remove(["storedLog"]))
                                );
                        }
                        "saveItems" == e ? ((M = N), (k = `https://${c}/items/${M.id}/edit`)) : ((M = submitDraftResponse?.item), (k = M?.url)),
                            await L(
                                "1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==",
                                r.title,
                                "jljJDBy0qMRbTEFMz0nORjT8cxNqZwIvTZzXscaqBIWHDemkqZgkoXEu1WUeiYjT7FU=--Vj+VQyw9JA2/acJM--mfySWZe+9JJWVU/xJBaNDg==",
                                S
                            ),
                            (dataFromStorage = await s(["doneList"]));
                        let O = dataFromStorage.doneList,
                            J = {
                                id: M.id,
                                title: M.title,
                                url: k,
                                is_hidden: M.is_hidden,
                                is_reserved: M.is_reserved,
                                is_draft: M.is_draft,
                                can_be_sold: M.can_be_sold,
                                processName: e,
                                thumbnail_url: M?.photos[0]?.thumbnails[0]?.url,
                                timestamp: new Date().getTime(),
                            };
                        if (
                            (O.unshift(J),
                            await chrome.storage.local.set({ doneList: O }),
                            await I("mainList", [`${r.id}`], !1),
                            await I("sideList", [`${r.id}`], !1),
                            await L(
                                "1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==",
                                r.title,
                                "MWgdJjmtmXnj3sEoJXDRNdd6UCpeMKNL8PaMXq4DVUtumaZMXsCu2VOM6n9ERg==--kHZ5J08AzwaOeHS/--xvZh9hjzspJ2G08qRAGoTw==",
                                S
                            ),
                            i && r.can_be_sold)
                        ) {
                            let s;
                            try {
                                s = await m(M.id, M.title, (showProgressUiError = !1), (retryOn404 = !0), "RAS-FA2", S, (functionCallNumber = 0));
                            } catch (e) {
                                (errorMessage = `<b>Perte de connexion avec Vinted</b> en vérifiant l'article "${r.title.slice(0, 30)}"" - Par précaution, Clemz s'arrête.`),
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: errorMessage,
                                        showUiMessage: !1,
                                        devMessage: `RAS-FA2 - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                    (s = { errorMessage: errorMessage });
                            }
                            if ("not_found" == s.errorType)
                                return (
                                    y(
                                        "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                        `${r.title} - ${JSON.stringify(s)}`,
                                        "B3ZBh7ui+J2P4NyRI8qOVpUFB9JnI0mfro3pojib5G2uT4XOQ4mCf6Ks--p/3E3MGR0Dcqmzb0--73+TytsKs/tZgwxUdSJtaA==",
                                        S
                                    ),
                                    x(r, "Vinted ne retrouve pas la nouvelle annonce : Vérifies ton dressing", (putAtSamePosition = !0), (majorError = !0), (actionAfterMajorError = "repost")),
                                    chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: o,
                                            totalIndex: t.length,
                                            stage: `Vinted ne retrouve pas "${r.title.slice(0, 30)}". Vérifies ton dressing`,
                                            articleName: "XX ERREUR - disparition ? XX",
                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                            showLoader: !1,
                                            processFinishedButton: "close",
                                        },
                                        globalUiMessage: { content: "<b>Vinted ne retrouve pas la nouvelle annonce</b><br>Vérifies ton dressing !", type: "danger" },
                                    }),
                                    void (await chrome.storage.local.remove(["storedLog"]))
                                );
                            if (null != s.errorMessage)
                                return (
                                    y(
                                        "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                        `${r.title} - ${JSON.stringify(s)}`,
                                        "B3ZBh7ui+J2P4NyRI8qOVpUFB9JnI0mfro3pojib5G2uT4XOQ4mCf6Ks--p/3E3MGR0Dcqmzb0--73+TytsKs/tZgwxUdSJtaA==",
                                        S
                                    ),
                                    await I("mainList", [`${r.id}`], !1),
                                    await I("sideList", [`${r.id}`], !1),
                                    chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: o,
                                            totalIndex: t.length,
                                            stage: `Erreur en vérifiant "${r.title.slice(0, 30)}" - Par précaution, Clemz s'arrête.`,
                                            articleName: "XX ERREUR de vérif XX",
                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                            showLoader: !1,
                                            processFinishedButton: "close",
                                        },
                                        globalUiMessage: { content: s.errorMessage, type: "warning" },
                                    }),
                                    void (await chrome.storage.local.remove(["storedLog"]))
                                );
                            let a = s.item;
                            if (a.photos.length != r.full_data.photos.length) {
                                y("AOeS9XsT39rIMpIjx3uqQw==--x4F4CZE+8NlnYvfs--Z429RAzB1httzB2FcfxWew==", r.title, "kj+HPMFKnMZxL7c7UEWKnI97rNHZHGRg96MHcD3nO9NCHkeZGCug4BcQaajweg==--TmBqFJeREalNfQx2--Cu2KhxBSKDybmF9AMtXheQ==", S);
                                let s = { currentIndex: o, totalIndex: t.length, stage: "vérification supplémentaire", articleName: r.title, articleImageUrl: r.thumbnail_url, showLoader: !0 };
                                chrome.storage.local.set({ progressUiMessage: s });
                                let n = [];
                                for (photoObject of r.full_data.photos) n.push(photoObject.full_size_url);
                                try {
                                    photoBlobsArray = await U(n, s, "RAS-FPVP2", S, (functionCallNumber = 0));
                                } catch (e) {
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: "",
                                        showUiMessage: !1,
                                        devMessage: `RAS-FPVP2 - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                        (photoBlobsArray = { errorMessage: !0 });
                                }
                                if (null != photoBlobsArray.errorMessage)
                                    return (
                                        y(
                                            "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                            `${r.title} - ${JSON.stringify(photoBlobsArray)}`,
                                            "IYbLYhlv3mY98W8EME/z/uLcvlygn7Sql5M3cPsyNHZtq8izEWbG0j1FmPV2EsGGLWTJ--V2Y2JWVNK44AvD28--THSDL0ICpnCqNEmLsn87Lg==",
                                            S
                                        ),
                                        chrome.storage.local.set({
                                            globalUiMessage: { content: `<b>Erreur photo - Mode Rapide</b><br>Votre annonce "${r.title.slice(0, 30)}" a peut-être perdu ses photos à cause du mode rapide.`, type: "danger" },
                                            progressUiMessage: {
                                                currentIndex: o,
                                                totalIndex: t.length,
                                                stage: "Bug dû au mode rapide - vos photos sont peut-être perdues",
                                                articleName: "XX ERREUR de photos XX",
                                                articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                showLoader: !1,
                                                processFinishedButton: "dressing",
                                            },
                                        }),
                                        void (await chrome.storage.local.remove(["storedLog"]))
                                    );
                                try {
                                    postedPhotosIdsArray = await g(photoBlobsArray, s, "RAS-PP3", S, u, (functionCallNumber = 0));
                                } catch (e) {
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: "",
                                        showUiMessage: !1,
                                        devMessage: `RAS-PP3 - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                        (postedPhotosIdsArray = { errorMessage: !0 });
                                }
                                if (null != postedPhotosIdsArray.errorMessage)
                                    return (
                                        y(
                                            "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                            `${r.title} - ${JSON.stringify(postedPhotosIdsArray)}`,
                                            "9eHInOE66qBB2EWuQYoMR0MZj91zSiDBcCdNqloZhGe+k6ZoHot46A==--xNb5Y/XFkcJKPlcP--Im5ib43+qtWGv744snMk3g==",
                                            S
                                        ),
                                        chrome.storage.local.set({
                                            globalUiMessage: {
                                                content: `<b>Erreur photo - Mode Rapide</b><br>Votre annonce "${r.title.slice(0, 30)}" a peut-être perdu ses photos à cause du mode rapide.<br><a href="${k}">Lien vers l'article</a>`,
                                                type: "danger",
                                            },
                                            progressUiMessage: {
                                                currentIndex: o,
                                                totalIndex: t.length,
                                                stage: "Bug dû au mode rapide - vos photos sont peut-être perdues",
                                                articleName: "XX ERREUR de photos XX",
                                                articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                showLoader: !1,
                                                processFinishedButton: "dressing",
                                            },
                                        }),
                                        void (await chrome.storage.local.remove(["storedLog"]))
                                    );
                                w.assigned_photos = [];
                                for (let e of postedPhotosIdsArray) w.assigned_photos.push({ id: e, orientation: 0 });
                                try {
                                    (articleType = "item"), "saveItems" == e && (articleType = "draft"), (assignPhotosAgainResponse = await f(w, articleType, a.id, "RAS-UA3", S, u, (functionCallNumber = 0)));
                                } catch (e) {
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: "",
                                        showUiMessage: !1,
                                        devMessage: `RAS-UA3 - code - ${r.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                        (assignPhotosAgainResponse = { errorMessage: !0 });
                                }
                                if (null != assignPhotosAgainResponse.errorMessage)
                                    return (
                                        y(
                                            "QxQT2MoozyNWID9iZulkcEblUv/kTI3qIC8Dyi+afeOyx8uF--ieI4qZxGYwNLkupj--0rLl8o+jRmiSzr7MTRZg/w==",
                                            `${r.title} - ${JSON.stringify(assignPhotosAgainResponse)}`,
                                            "p5bVdyV1FkVapcBko1ey4kCEBiObieT/pZQ2rcvYO31PGeM7od3pHl+N3A==--T6aKgRXF6hzAvQ2u--uRgGAS35lBx/dB7KUTJQig==",
                                            S
                                        ),
                                        chrome.storage.local.set({
                                            globalUiMessage: {
                                                content: `<b>Erreur photo - Mode Rapide</b><br>Votre annonce "${r.title.slice(0, 30)}" a peut-être perdu ses photos à cause du mode rapide.<a href="${k}">Lien vers l'article</a>`,
                                                type: "danger",
                                            },
                                            progressUiMessage: {
                                                currentIndex: o,
                                                totalIndex: t.length,
                                                stage: "Bug dû au mode rapide - vos photos sont peut-être perdues",
                                                articleName: "XX ERREUR de photos XX",
                                                articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                showLoader: !1,
                                                processFinishedButton: "dressing",
                                            },
                                        }),
                                        void (await chrome.storage.local.remove(["storedLog"]))
                                    );
                            }
                        }
                        await L("1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==", r.title, "RYc7e7KISdFAjQpcqY0y8IEGpzjJ6w3l2EEBdAssMQ==--DTTYqhbAUpnEEKi/--r8OVl/tF5rs7wYWBedm/Kg==", S), A++;
                        let _,
                            $ = { id: r.id, title: r.title, newUrl: k };
                        try {
                            _ = await v(e, S, $);
                        } catch (e) {
                            chrome.runtime.sendMessage({
                                message: "error",
                                origin: "code",
                                uiMessage: "<b>Erreur de com avec clemz.app</b>",
                                showUiMessage: !0,
                                devMessage: `RAS-UAc - code - ${r.title}`,
                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                showProgressUiError: !0,
                            }),
                                (_ = "fail");
                        }
                        if ("success" != _) return;
                        if (
                            (await L("1dmvLjEmmMhskGVdtTorPRbU/goxase75zG59A==--Q2m1wIaNXV19iwP7--TX0DoA0tRazXbfIxZoIuMA==", r.title, "v5p6GCQRgK8AFRCVVpbbf4S9gXXhTg==--C1A1T/83U2RBr6Yq--7rIHZso5Y78/lHxxVY28gQ==", S), a && "saveItems" != e)
                        ) {
                            let e;
                            chrome.storage.local.set({ progressUiMessage: { currentIndex: o, totalIndex: t.length, stage: `ajout des vues (0/${n})`, articleName: r.title, articleImageUrl: r.thumbnail_url, showLoader: !0 } });
                            try {
                                e = await T(k, n, o, t.length, r.title, r.thumbnail_url, M.id);
                            } catch (e) {
                                chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "",
                                    showUiMessage: !1,
                                    devMessage: `RAS-AVTI - code - ${r.title}`,
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !1,
                                });
                            }
                            if ("OK" != e)
                                return (
                                    chrome.runtime.sendMessage({ message: "error", origin: "vinz", uiMessage: "", showUiMessage: !1, devMessage: `RAS-AVTI - vinz - ${r.title}`, backtrace: '{"status":"views"}', showProgressUiError: !1 }),
                                    void chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: o,
                                            totalIndex: t.length,
                                            stage: 'Corriger le souci : <a href="https://www.clemz.app/documentation/resoudre-un-bug#lajoutdevuesnefonctionnepas" target="_blank">clique ici</a>',
                                            articleName: "XX ERREUR ajout vues XX",
                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                            showLoader: !1,
                                            processFinishedButton: "close",
                                        },
                                    })
                                );
                        }
                    }
                    await chrome.storage.local.remove(["storedLog"]);
                    let k = "J'ai fait le boulot ! 🦾",
                        N = "images/bot_celebration.png",
                        O = "Republication terminée",
                        J = "dressing";
                    r && (O = "Republication 1 par 1 terminée"),
                        A < t.length &&
                            ((itemsNotRepostedCount = t.length - A),
                            (k = `➡️ ${itemsNotRepostedCount} articles non republiés<br><div class="border rounded mt-3 p-2 border-sm border-danger">Clique sur les erreurs (⚠️ /🆘) dans ta liste "à traiter"</div>`),
                            (N = "images/bot_surprised.png"),
                            (J = "showLists")),
                        chrome.storage.local.set({ progressUiMessage: { currentIndex: t.length, totalIndex: t.length, stage: k, articleName: O, articleImageUrl: chrome.runtime.getURL(N), showLoader: !1, processFinishedButton: J } }),
                        setTimeout(function () {
                            chrome.storage.local.set({ repostActivityUid: "" });
                        }, 2e3);
                }
                async function L(e, t, o, s) {
                    await chrome.storage.local.set({ storedLog: { activityUid: s, messageClear: t, messageEncrypted: o, title: e } });
                }
                async function C(e) {
                    return (
                        (articlePostBody = e),
                        (articlePostBody.color_ids = [e.color1_id, e.color2_id]),
                        (articlePostBody.price = parseFloat(e.price_numeric)),
                        (articlePostBody.defect_ids = []),
                        (articlePostBody.is_hidden = 0),
                        articlePostBody
                    );
                }
                async function E(e, t, o) {
                    y("iZe8Vcf1ltclZ1GclAesuwvMQ3VmlQhW4AofQXGOqy2PW05xVoA=--f/BqUSNXGM3eF110--kJDfafUvVAn1GNtgEiyCmg==", e.title, "PzqI37SoVLtwfeyTKYtFrEiqWYySuPu31fsdOzV2Q7LTavc9F/S2xLbl--aJdi0cFo/GRuVMnS--MbnsHFuRwoTOER6oHoNiKg==", t);
                    try {
                        response = await h(e.id, e.title, "RAS-RBDND", t, o, (functionCallNumber = 0));
                    } catch (t) {
                        chrome.runtime.sendMessage({
                            message: "error",
                            origin: "code",
                            uiMessage: "",
                            showUiMessage: !1,
                            devMessage: `RAS-RBDND - code - ${e.title}`,
                            backtrace: JSON.stringify(t, ["message", "arguments", "type", "name"]),
                            showProgressUiError: !1,
                        }),
                            (response = { errorMessage: !0 });
                    }
                    return response.errorMessage ? "fail" : "success";
                }
                async function R(e, t, o, s) {
                    y(
                        "iZe8Vcf1ltclZ1GclAesuwvMQ3VmlQhW4AofQXGOqy2PW05xVoA=--f/BqUSNXGM3eF110--kJDfafUvVAn1GNtgEiyCmg==",
                        e.title,
                        "4LGBGnpumREztjyBEEkzdJMCfOThXwWjwSc0cONR1RuW0+8bOF2724y+Og==--0hmk30D4XxsWguZm--NFTbTd2qjrWjgVWAe/OIfw==",
                        o
                    );
                    try {
                        response = await b(e, t, "RAS-RBSND", o, s, (functionCallNumber = 0));
                    } catch (t) {
                        chrome.runtime.sendMessage({
                            message: "error",
                            origin: "code",
                            uiMessage: "",
                            showUiMessage: !1,
                            devMessage: `RAS-RBSND - code - ${e.title}`,
                            backtrace: JSON.stringify(t, ["message", "arguments", "type", "name"]),
                            showProgressUiError: !1,
                        }),
                            (response = { errorMessage: !0 });
                    }
                    return response.errorMessage ? "fail" : "success";
                }
                function T(e, t, o, s, r, a, n) {
                    return new Promise((i, c) => {
                        chrome.runtime.sendMessage({ message: "addViewsToSingleItem", url: e, viewCount: t, currentIndex: o, totalIndex: s, articleName: r, articleImageUrl: a, articleId: n }, (e) => {
                            i(e);
                        });
                    });
                }
                t.exports = {
                    ge: async function (e) {
                        chrome.storage.local.remove(["globalUiMessage"]);
                        const t = window.location.hostname;
                        if ("success" != (await w())) return;
                        let o = await s(["mainList", "userInfo", "activeAlertsArray"]),
                            r = o.mainList,
                            a = o.userInfo,
                            n = o.activeAlertsArray,
                            i = c(a),
                            g = document.querySelector("#repostOnebyOne")?.checked,
                            p = document.querySelector("#addViewsReposting")?.checked,
                            f = parseInt(document.querySelector("#maxViewsRepostingSelect")?.value),
                            h = document.querySelector("#quickRepostMode")?.checked;
                        if ((await d(), "disconnected" == i))
                            return void chrome.storage.local.set({ globalUiMessage: { content: `<p>Connecte-toi à ton compte Vinted : <a href="https://${t}/member/general/login">clique ici</a></p>`, type: "warning" } });
                        if ("admin" != a.role && "wrong profile" == i && "" != a.profileUrl)
                            return void chrome.storage.local.set({ globalUiMessage: { content: `Tu n'es pas connecté sur Vinted au compte de @${a.username} <b>=>connecte-toi au bon compte</b>`, type: "warning", time: 5e3 } });
                        if ((o.userInfo.email, !r || 0 == r.length))
                            return void (await chrome.storage.local.set({
                                globalUiMessage: {
                                    content: `Liste "à traiter" vide : remplissez-la. <br>(via l'onglet <img class="font-icon text-primary ml-1" src="${chrome.runtime.getURL(
                                        "images/list-solid.svg"
                                    )}"> <span class="text-primary">Remplir mes listes</span>)`,
                                    type: "warning",
                                },
                            }));
                        if ("continue" != (await u(e, n))) return;
                        chrome.storage.local.set({
                            progressUiMessage: {
                                currentIndex: 0,
                                totalIndex: r.length,
                                stage: "En cas de souci, je t'alerte !",
                                articleName: `Vérification des ${r.length} articles`,
                                articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                showLoader: !0,
                            },
                        }),
                            g && (r = [r[0]]);
                        let b = 0,
                            M = 0,
                            v = 0,
                            y = 0,
                            U = 0,
                            S = [],
                            L = [];
                        for (const [e, t] of r.entries()) {
                            let o;
                            chrome.storage.local.set({
                                progressUiMessage: {
                                    currentIndex: e,
                                    totalIndex: r.length,
                                    stage: "En cas de souci, je t'alerte !",
                                    articleName: `Vérification des ${r.length} articles`,
                                    articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                    showLoader: !0,
                                },
                            });
                            try {
                                o = await m(t.id, t.title, (showProgressUiError = !1), (retryOn404 = !1), "RAS-FA1", null, (functionCallNumber = 0));
                            } catch (e) {
                                (errorMessage = `<b>Perte de connexion avec Vinted</b> en récupérant l'article "${t.title.slice(0, 30)}"`),
                                    chrome.runtime.sendMessage({
                                        message: "error",
                                        origin: "code",
                                        uiMessage: errorMessage,
                                        showUiMessage: !0,
                                        devMessage: `RAS-FA1 - code - ${t.title}`,
                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                        showProgressUiError: !1,
                                    }),
                                    (o = { errorMessage: errorMessage });
                            }
                            if ("not_found" == o.errorType) {
                                await I("mainList", [`${t.id}`], !1), await I("sideList", [`${t.id}`], !1), U++;
                                continue;
                            }
                            if (null != o.errorMessage)
                                return (
                                    x(t, o.errorMessage, !1),
                                    void chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: e,
                                            totalIndex: r.length,
                                            stage: `Erreur en récupérant "${t.title.slice(0, 30)}"`,
                                            articleName: "XX ERREUR lors de la vérif XX",
                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                            showLoader: !1,
                                            processFinishedButton: "close",
                                        },
                                    })
                                );
                            if (t.majorError)
                                if ("delete" == t.actionAfterMajorError) await I("mainList", [`${t.id}`], !1);
                                else if ("repost" == t.actionAfterMajorError && ((userChoiceOnMajorError = await k(t, "repost")), "cancel" == userChoiceOnMajorError)) continue;
                            let s = A(o);
                            await N("mainList", t.id, s),
                                await N("sideList", t.id, s),
                                null != o.item.photos[0]
                                    ? (s.full_data && l(s.full_data, "user") && b++, 1 != s.is_draft ? (s.can_be_sold && (1 == s.is_reserved || s.promoted) ? v++ : L.push(s), 1 != s.can_be_sold ? y++ : 1 == s.is_hidden && M++) : S.push(s))
                                    : x(t, "Erreur : article sans photo", !1);
                        }
                        let C = r.length - (M + v + y + S.length),
                            E = [];
                        if ("saveItems" == e || "repostItems" == e) {
                            let t;
                            if (((t = "saveItems" == e ? "sauvegarde" : "republication"), r.length == S.length + v))
                                return void chrome.storage.local.set({
                                    progressUiMessage: {
                                        currentIndex: r.length,
                                        totalIndex: r.length,
                                        stage: `${t} impossible: les articles sont soit des brouillons, soit réservés, soit boostés.`,
                                        articleName: "XX ERREUR après vérif XX",
                                        articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                        showLoader: !1,
                                        processFinishedButton: "close",
                                    },
                                });
                            let o = "";
                            if (
                                (C != r.length || b > 0 || U > 0) &&
                                ((o += "🔔🔔🔔🔔🔔🔔🔔🔔\n"),
                                (C != r.length || b > 0) && (o += 'La liste "à traiter" contient les articles spéciaux suivants :\n'),
                                b > 0 && (o += `- ${b} articles "📛 REPÉRÉS" (conseil : ne republier que si tu changes d'abord les photos).\n`),
                                y > 0 && (o += `- ${y} articles VENDUS (l'annonce vendue sera conservée)\n`),
                                M > 0 && (o += `- ${M} articles MASQUÉS\n`),
                                v > 0 && (o += `- ${v} articles RÉSERVÉS ou BOOSTÉS (${t} impossible)\n`),
                                S.length > 0 && (o += `- ${S.length} BROUILLONS (${t} impossible)\n`),
                                U > 0 && (o += `Pour info, ${U} articles ont été enlevés de la liste car ils n'existaient plus (déjà supprimés)\n`),
                                L.length > 0
                                    ? (o += `\n🛑 Confirmes-tu la ${t} de ${L.length} articles de la liste 📥"à traiter" ?`)
                                    : (o += g
                                          ? `\nClemz ne peut pas faire de  ${t} sur l'article du haut de ta liste (option "1 par 1" activée). Vérifie ta liste 🙂`
                                          : `\nIl ne reste aucun article sur lequel faire une ${t}. Merci de refaire ta liste 🙂`),
                                !confirm(o))
                            )
                                return void location.reload();
                            E = L;
                        } else {
                            if (0 == S.length)
                                return void chrome.storage.local.set({
                                    progressUiMessage: {
                                        currentIndex: r.length,
                                        totalIndex: r.length,
                                        stage: "La liste ne contient aucun brouillon pouvant être publié.",
                                        articleName: "XX ERREUR après vérif XX",
                                        articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                        showLoader: !1,
                                        processFinishedButton: "close",
                                    },
                                });
                            let e = "";
                            if (
                                (U > 0 || S.length < r.length) &&
                                (U > 0 && (e += `Pour info, ${U} articles ont été enlevés de la liste car ils n'existaient plus (déjà supprimés)\n \n`),
                                S.length < r.length && (e += `🔔🔔🔔🔔🔔🔔🔔🔔\n La liste "à traiter" contient ${r.length - S.length} ARTICLES qui ne seront pas traités (non éligibles)`),
                                S.length > 0 ? (e += `\n\n🛑 Confirmes-tu la publication de ${S.length} brouillon(s) de la liste 📥"à traiter" ?`) : (e += "\n\nIl ne reste aucun article à sauver. Merci de refaire ta liste 🙂"),
                                !confirm(e))
                            )
                                return void location.reload();
                            E = S;
                        }
                        if ("postDrafts" != e && E.length > a.repostLeft)
                            chrome.storage.local.set({
                                upgradeSubscriptionModalData: `<p class="text-center">⚠️Tes <span class="text-danger font-weight-bolder">${a.repostLeft} republications restantes</span> ne sont pas suffisantes pour republier les <b>${E.length}&nbsp;annonces</b> de ta liste "à traiter".</p>`,
                                progressUiMessage: {
                                    currentIndex: 0,
                                    totalIndex: 1,
                                    stage: "Pas assez de republications",
                                    articleName: "XX Process arrêté XX",
                                    articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                    showLoader: !1,
                                    processFinishedButton: "close",
                                },
                            });
                        else if (E.length <= 0)
                            chrome.storage.local.set({
                                progressUiMessage: {
                                    currentIndex: 0,
                                    totalIndex: 1,
                                    stage: "Aucun article à republier",
                                    articleName: "XX Process arrêté XX",
                                    articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                    showLoader: !1,
                                    processFinishedButton: "close",
                                },
                            });
                        else {
                            a.maxViews < f && (f = a.maxViews), (null == f || f < 0) && (f = 10);
                            try {
                                await O(e, E, a, g, p, f, h);
                            } catch (e) {
                                return void chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "<b>Erreur de Clemz</b><br>Réessaye ou contacte moi à clement@clemz.app",
                                    showUiMessage: !0,
                                    devMessage: "RAS-global - code",
                                    backtrace: JSON.stringify(e, Object.getOwnPropertyNames(e)),
                                    showProgressUiError: !0,
                                });
                            }
                        }
                    },
                };
            },
            { "./apiCalls.js": 1, "./manageListsScript.js": 6, "./utilities.js": 12 },
        ],
        8: [
            function (e, t, o) {
                const { t: s, W: r, ee: a } = e("./utilities.js"),
                    { u: n, C: i, D: c, X: l, H: u, R: d, m: m, q: g } = e("./apiCalls.js");
                async function p() {
                    chrome.storage.local.remove(["globalUiMessage"]);
                    window.location.hostname;
                    if ("success" != (await i())) return;
                    (dataFromStorage = await s(["userInfo", "activeAlertsArray"])), (activeAlertsArray = dataFromStorage.activeAlertsArray), (userInfo = dataFromStorage.userInfo);
                    let e = await a("sendFavs", activeAlertsArray);
                    if ("continue" != e) return;
                    if (((e = await a("requestFavs", activeAlertsArray)), "continue" != e)) return;
                    let t = await c();
                    "success" == t.message &&
                        (null != t?.data?.request_created_at
                            ? ((userInfo.lastRequestFavs = t.data.request_created_at),
                              chrome.storage.local.set({ userInfo: userInfo }),
                              chrome.storage.local.set({
                                  progressUiMessage: {
                                      currentIndex: 1,
                                      totalIndex: 1,
                                      stage: "💞 Demande de favoris créée 💞",
                                      articleName: "Demander des favoris",
                                      articleImageUrl: chrome.runtime.getURL("images/bot_celebration.png"),
                                      showLoader: !1,
                                      processFinishedButton: "close",
                                  },
                              }))
                            : (function (e, t) {
                                  fetch(chrome.runtime.getURL("html/toolModals/requestFavsWarning.html"))
                                      .then((e) => e.text())
                                      .then((o) => {
                                          r(o, "requestFavsWarning"),
                                              (document.querySelector("#max_favs").textContent = t.maxFavsPerRequest),
                                              document.querySelector("#cancelSendFavs").addEventListener("click", function () {
                                                  document.querySelector("#requestFavsWarning").remove(), chrome.storage.local.set({ globalUiMessage: { content: "annulation...", type: "warning", time: 1e3 } });
                                              }),
                                              document.querySelector("#confirmSendFavs").addEventListener("click", function () {
                                                  document.querySelector("#requestFavsWarning").remove(),
                                                      (async function (e) {
                                                          let t;
                                                          await chrome.storage.local.set({
                                                              progressUiMessage: {
                                                                  currentIndex: 0,
                                                                  totalIndex: 4,
                                                                  progressInPercent: !0,
                                                                  stage: "Clemz se prépare à distribuer...",
                                                                  articleName: "Donner des favoris",
                                                                  articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                                                  showLoader: !0,
                                                              },
                                                          }),
                                                              await n();
                                                          try {
                                                              t = await u("GET", (allowNotifications = null), (activityUid = null), (functionCallNumber = 0));
                                                          } catch (e) {
                                                              return void chrome.runtime.sendMessage({
                                                                  message: "error",
                                                                  origin: "code",
                                                                  uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant vos infos",
                                                                  showUiMessage: !0,
                                                                  devMessage: "RFS-SNTF1 - code",
                                                                  backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                                  showProgressUiError: !0,
                                                              });
                                                          }
                                                          if (t.errorMessage) return;
                                                          let o = t.user.allow_my_favourite_notifications;
                                                          if (o) {
                                                              try {
                                                                  t = await u("PUT", (allowNotifications = !1), (activityUid = null), (functionCallNumber = 0));
                                                              } catch (e) {
                                                                  return void chrome.runtime.sendMessage({
                                                                      message: "error",
                                                                      origin: "code",
                                                                      uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant vos infos",
                                                                      showUiMessage: !0,
                                                                      devMessage: "RFS-SNTF2 - code",
                                                                      backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                                      showProgressUiError: !0,
                                                                  });
                                                              }
                                                              if (t.errorMessage) return;
                                                          }
                                                          let s = -1;
                                                          for (let t of e) {
                                                              s++,
                                                                  await chrome.storage.local.set({
                                                                      progressUiMessage: {
                                                                          currentIndex: s,
                                                                          totalIndex: e.length,
                                                                          progressInPercent: !0,
                                                                          stage: "Clemz envoie des favoris",
                                                                          articleName: "Donner des favoris",
                                                                          articleImageUrl: chrome.runtime.getURL("images/bot_heart_face.png"),
                                                                          showLoader: !0,
                                                                      },
                                                                  });
                                                              let r = "exchangeFavs=true - turnOffNotifsFavs=true",
                                                                  a = { receiverProfileUrl: t.user_profile, exchangeFavs: !0 },
                                                                  n = await d(1, "sendFavs", r, a, (parentActivityUid = t.uid));
                                                              if ("success" != n.message) return void (o && f(""));
                                                              const i = n.activityUid;
                                                              let c,
                                                                  u = t.user_profile.split("-")[0];
                                                              try {
                                                                  c = await m(u, (per_page = 100), 1, i, (functionCallNumber = 0));
                                                              } catch (e) {
                                                                  return (
                                                                      chrome.runtime.sendMessage({
                                                                          message: "error",
                                                                          origin: "code",
                                                                          uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant le dressing du Vintie",
                                                                          showUiMessage: !0,
                                                                          devMessage: "RFS-FUI - code",
                                                                          backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                                          showProgressUiError: !0,
                                                                      }),
                                                                      void (o && f(i))
                                                                  );
                                                              }
                                                              if (null != c.errorMessage) return void (o && f(i));
                                                              let p = c.items.filter((e) => 0 == e.is_favourite);
                                                              p = t.request_day ? p.filter((e) => Date.parse(e.created_at_ts) > Date.parse(t.request_day)) : p.splice(0, 30);
                                                              let h = p.length;
                                                              for (; p.length > 0; ) {
                                                                  let e,
                                                                      t = p.splice(0, 50);
                                                                  try {
                                                                      e = await g(t, i, (functionCallNumber = 0));
                                                                  } catch (e) {
                                                                      return (
                                                                          chrome.runtime.sendMessage({
                                                                              message: "error",
                                                                              origin: "code",
                                                                              uiMessage: "<b>Erreur de connexion avec Vinted</b> en rajoutant les favoris",
                                                                              showUiMessage: !0,
                                                                              devMessage: "SFS-TF - code",
                                                                              backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                                              showProgressUiError: !0,
                                                                          }),
                                                                          void (o && f(i))
                                                                      );
                                                                  }
                                                              }
                                                              if (((updatedOptionsString = `favouritesCount=${h}`), "success" != (await l(i, updatedOptionsString)))) return void (o && f(i));
                                                          }
                                                          o && f(activityUid);
                                                          setTimeout(function () {
                                                              chrome.storage.local.set({ activityUid: "" });
                                                          }, 2e3),
                                                              await chrome.storage.local.set({
                                                                  progressUiMessage: {
                                                                      currentIndex: e.length,
                                                                      totalIndex: e.length,
                                                                      progressInPercent: !0,
                                                                      stage: "Distribution terminée",
                                                                      articleName: "Donner des favoris",
                                                                      articleImageUrl: chrome.runtime.getURL("images/bot_celebration.png"),
                                                                      showLoader: !0,
                                                                  },
                                                              }),
                                                              p();
                                                      })(e);
                                              });
                                      });
                              })(t.data.request_favs, userInfo));
                }
                async function f(e) {
                    try {
                        userInfoDetails = await u("PUT", (allowNotifications = !0), e, (functionCallNumber = 0));
                    } catch (e) {
                        return void chrome.runtime.sendMessage({
                            message: "error",
                            origin: "code",
                            uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant vos infos",
                            showUiMessage: !0,
                            devMessage: "SFS-SNTF1 - code",
                            backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                            showProgressUiError: !0,
                        });
                    }
                }
                t.exports = { pe: p };
            },
            { "./apiCalls.js": 1, "./utilities.js": 12 },
        ],
        9: [
            function (e, t, o) {
                const { t: s } = e("./utilities.js");
                async function r() {
                    let e = document.querySelector("#selectTitle").dataset.selection.split(";");
                    for (element of ((articleElements = document.getElementsByClassName("feed-grid__item")), articleElements)) {
                        if (element.querySelector("[class*='vinz']")) continue;
                        if (element.querySelector("img") && element.querySelector("img").src.includes("chrome-extension")) continue;
                        if (null == element.querySelector("[class*='ItemBox__image-container']")) continue;
                        const t = element.querySelector("[class*='ItemBox__image-container']").querySelector("a");
                        if (null == t) continue;
                        const o = t.href.split("/");
                        o.includes("edit") ? (articleId = o[o.length - 2]) : ((endOfLink = o[o.length - 1]), (articleId = endOfLink.split("-")[0])),
                            element.querySelector("[class*='ItemBox__image-container']").setAttribute("articleId", `${articleId}`),
                            e.includes(articleId) ? element.querySelector("[class*='ItemBox__image-container']").classList.add("vinz-selected") : element.querySelector("[class*='ItemBox__image-container']").classList.add("vinz-waiting"),
                            element.addEventListener("click", function () {
                                let e = this.querySelector("[class*='ItemBox__image-container']"),
                                    t = e.getAttribute("articleId"),
                                    o = document.querySelector("#selectedCount"),
                                    s = document.querySelector("#selectTitle"),
                                    r = s.dataset.selection.split(";");
                                e.classList.contains("vinz-selected")
                                    ? (e.classList.remove("vinz-selected"), e.classList.add("vinz-waiting"), (s.dataset.selection = r.filter((e) => e != `${t}`).join(";")))
                                    : (e.classList.add("vinz-selected"), e.classList.remove("vinz-waiting"), (s.dataset.selection = r.concat([t]).join(";")));
                                let a = document.querySelectorAll(".vinz-selected").length;
                                o && ((o.style.display = "block"), (o.textContent = `(${a} ✅)`));
                            });
                        const s = element.querySelectorAll("a");
                        for (element of s) {
                            let e = document.createElement("a");
                            (e.className = element.className), (e.innerHTML = element.innerHTML), element.parentNode.replaceChild(e, element);
                        }
                    }
                }
                t.exports = {
                    me: async function () {
                        const e = await s(["userInfo"]),
                            t = e.userInfo.profileUrl,
                            o = e.userInfo.role;
                        let a = window.location.href;
                        "" != t || a.includes("member")
                            ? "admin" == o || "" == t || a.includes(t) || a.includes("search_text")
                                ? (function (e) {
                                      if (null == document.querySelector(".selectionOngoing")) {
                                          let e = document.createElement("div");
                                          e.classList.add("selectionOngoing"), (e.id = "selectTitle"), (e.dataset.selection = ""), (e.innerHTML = "== Clique sur les articles pour les sélectionner ==");
                                          let t = document.querySelector("[class*='feed-grid']");
                                          t && t.parentNode.insertBefore(e, t.parentNode.firstChild);
                                      }
                                      const t = document.body,
                                          o = { attributes: !1, childList: !0, subtree: !0 };
                                      new MutationObserver(function (e, t) {
                                          r();
                                      }).observe(t, o),
                                          r(),
                                          document.querySelector("#selectOptions").classList.remove("d-none"),
                                          document.querySelector("#unselectAllButton").addEventListener("click", function () {
                                              let e = document.querySelectorAll(".feed-grid__item .vinz-selected");
                                              if (null != e) for (let t of e) t.click();
                                          }),
                                          document.querySelector("#selectTopArticlesForm").addEventListener("submit", function () {
                                              event.preventDefault();
                                              let e = document.querySelectorAll(".feed-grid__item [class*='ItemBox__image-container']");
                                              if (null == e) return;
                                              let t = document.querySelector("#selectTopArticlesValue").value,
                                                  o = 0;
                                              for (let s of e) {
                                                  if (o >= t) break;
                                                  o++, s.classList.contains("vinz-selected") || s.click();
                                              }
                                          });
                                  })()
                                : chrome.storage.local.set({
                                      globalUiMessage: {
                                          content: `Cette action doit être effectuée sur ta page de dressing Vinted ${t} (<a href="${window.location.origin}/member/${t}" class="text-primary">=>clique ici<=</a>)`,
                                          type: "warning",
                                      },
                                  })
                            : chrome.storage.local.set({ globalUiMessage: { content: "Cette action doit être effectuée sur ta page de dressing Vinted", type: "warning" } });
                    },
                };
            },
            { "./utilities.js": 12 },
        ],
        10: [
            function (e, t, o) {
                const { t: s, i: r, ee: a } = e("./utilities.js"),
                    { C: n, u: i, m: c, R: l, T: u, q: d, H: m } = e("./apiCalls.js");
                t.exports = {
                    de: async function () {
                        if ((chrome.storage.local.remove(["globalUiMessage"]), "success" != (await n()))) return;
                        const e = await s(["userInfo", "activeAlertsArray"]),
                            t = e.userInfo,
                            o = e.activeAlertsArray;
                        let r = window.location.pathname;
                        if (!r.includes("/member/")) return void chrome.storage.local.set({ globalUiMessage: { content: "<b>Action à effectuer sur un dressing</b><br>Cette action ne peut être effectuée sur cette page", type: "danger" } });
                        if (r.includes(t.profileUrl))
                            return void chrome.storage.local.set({ globalUiMessage: { content: "<b>Vous êtes sur votre dressing</b><br>Cette action doit être lancée sur le dressing d'un autre membre", type: "danger" } });
                        let g = window.location.href.split("/"),
                            p = g[g.length - 1],
                            f = p.split("-")[0];
                        const h = new RegExp("^[0-9]*$");
                        if (!f || !h.test(f)) return void chrome.storage.local.set({ globalUiMessage: { content: "<b>Détection du dressing impossible</b><br>Réessaye ou contacte moi à clement@clemz.app", type: "danger" } });
                        let b = document.querySelector("#sendFavouritesCount").value;
                        if (!b || b <= 0) return void chrome.storage.local.set({ globalUiMessage: { content: "<b>Nombre de favoris vide</b><br>Merci de saisir un nombre de favoris valable", type: "warning" } });
                        if (b > 50) return void chrome.storage.local.set({ globalUiMessage: { content: "<b>Nombre de favoris trop grand</b><br>Par sécurité, évite de donner plus de 50 favoris", type: "warning" } });
                        let w = document.querySelector("#addViewsSendFavs").checked,
                            M = document.querySelector("#turnOffNotifsFavs").checked;
                        if ("continue" == (await a("sendFavs", o)))
                            try {
                                !(async function (e, t, o, s, r) {
                                    (totalIndex = s ? 3 : 2),
                                        await chrome.storage.local.set({
                                            progressUiMessage: {
                                                currentIndex: 0,
                                                totalIndex: totalIndex,
                                                stage: "Clemz récupère les articles...",
                                                articleName: "Donner des favoris",
                                                articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                                showLoader: !0,
                                            },
                                        }),
                                        await i();
                                    let a = `favouritesCount=${e} - addViews=${s} - maxViewsSelected=1 - turnOffNotifsFavs=${r}`,
                                        n = { receiverProfileUrl: t },
                                        g = await l(1, "sendFavs", a, n);
                                    if ("success" != g.message) return;
                                    const p = g.activityUid;
                                    let f, h;
                                    if (r) {
                                        let e;
                                        try {
                                            e = await m("GET", (allowNotifications = null), p, (functionCallNumber = 0));
                                        } catch (e) {
                                            return void chrome.runtime.sendMessage({
                                                message: "error",
                                                origin: "code",
                                                uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant vos infos",
                                                showUiMessage: !0,
                                                devMessage: "SFS-SNTF1 - code",
                                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                showProgressUiError: !0,
                                            });
                                        }
                                        if (e.errorMessage) return;
                                        if (((f = e.user.allow_my_favourite_notifications), f)) {
                                            try {
                                                e = await m("PUT", (allowNotifications = !1), p, (functionCallNumber = 0));
                                            } catch (e) {
                                                return void chrome.runtime.sendMessage({
                                                    message: "error",
                                                    origin: "code",
                                                    uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant vos infos",
                                                    showUiMessage: !0,
                                                    devMessage: "SFS-SNTF2 - code",
                                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                    showProgressUiError: !0,
                                                });
                                            }
                                            if (e.errorMessage) return;
                                        }
                                    }
                                    try {
                                        h = await c(o, (per_page = 100), 1, p, (functionCallNumber = 0));
                                    } catch (e) {
                                        return void chrome.runtime.sendMessage({
                                            message: "error",
                                            origin: "code",
                                            uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant le dressing du Vintie",
                                            showUiMessage: !0,
                                            devMessage: "SFS-FUI - code",
                                            backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                            showProgressUiError: !0,
                                        });
                                    }
                                    if (null != h.errorMessage) return;
                                    let b = h.items.slice(0, e).filter((e) => 0 == e.is_favourite);
                                    await chrome.storage.local.set({
                                        progressUiMessage: {
                                            currentIndex: 1,
                                            totalIndex: totalIndex,
                                            stage: "Clemz distribue les favoris",
                                            articleName: "Donner des favoris",
                                            articleImageUrl: chrome.runtime.getURL("images/bot_heart_face.png"),
                                            showLoader: !0,
                                        },
                                    });
                                    try {
                                        toggleFavouriteReponse = await d(b, p, (functionCallNumber = 0));
                                    } catch (e) {
                                        return void chrome.runtime.sendMessage({
                                            message: "error",
                                            origin: "code",
                                            uiMessage: "<b>Erreur de connexion avec Vinted</b> en rajoutant les favoris",
                                            showUiMessage: !0,
                                            devMessage: "SFS-TF - code",
                                            backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                            showProgressUiError: !0,
                                        });
                                    }
                                    if ("ok" != toggleFavouriteReponse) return;
                                    if (s) {
                                        let e;
                                        await chrome.storage.local.set({
                                            progressUiMessage: {
                                                currentIndex: 2,
                                                totalIndex: 3,
                                                stage: "Clemz rajoute les vues",
                                                articleName: "Donner des favoris",
                                                articleImageUrl: chrome.runtime.getURL("images/bot_screen.png"),
                                                showLoader: !0,
                                            },
                                        });
                                        try {
                                            e = await ((w = b),
                                            new Promise((e, t) => {
                                                chrome.runtime.sendMessage({ message: "addViewsToItemsArray", itemsArray: w }, (t) => {
                                                    e(t);
                                                });
                                            }));
                                        } catch (e) {
                                            chrome.runtime.sendMessage({
                                                message: "error",
                                                origin: "code",
                                                uiMessage: "",
                                                showUiMessage: !1,
                                                devMessage: "SFS-AVWF - code",
                                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                showProgressUiError: !1,
                                            });
                                        }
                                        if ("OK" != e)
                                            return (
                                                chrome.runtime.sendMessage({ message: "error", origin: "vinz", uiMessage: "", showUiMessage: !1, devMessage: "SFS-AVWF - vinz", backtrace: '{"status":"views"}', showProgressUiError: !1 }),
                                                void chrome.storage.local.set({
                                                    progressUiMessage: {
                                                        currentIndex: 2,
                                                        totalIndex: 3,
                                                        stage: "L'ajout de vues a planté",
                                                        articleName: "XX ERREUR ajout vues XX",
                                                        articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                        showLoader: !1,
                                                        processFinishedButton: "refresh",
                                                    },
                                                })
                                            );
                                    }
                                    var w;
                                    if (r && f) {
                                        let e;
                                        try {
                                            e = await m("PUT", (allowNotifications = f), p, (functionCallNumber = 0));
                                        } catch (e) {
                                            return void chrome.runtime.sendMessage({
                                                message: "error",
                                                origin: "code",
                                                uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant vos infos",
                                                showUiMessage: !0,
                                                devMessage: "SFS-SNTF1 - code",
                                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                showProgressUiError: !0,
                                            });
                                        }
                                    }
                                    await u("sendFavs"),
                                        setTimeout(function () {
                                            chrome.storage.local.set({ activityUid: "" });
                                        }, 2e3),
                                        await chrome.storage.local.set({
                                            progressUiMessage: {
                                                currentIndex: totalIndex,
                                                totalIndex: totalIndex,
                                                stage: `Distribution terminée<br> <b>${b.length}</b> favoris envoyés<br> <b>${e - b.length}</b> favoris déjà présents`,
                                                articleName: "Donner des favoris",
                                                articleImageUrl: chrome.runtime.getURL("images/bot_celebration.png"),
                                                showLoader: !1,
                                                processFinishedButton: "refresh",
                                            },
                                        });
                                })(b, p, f, w, M);
                            } catch (e) {
                                return void chrome.runtime.sendMessage({
                                    message: "error",
                                    origin: "code",
                                    uiMessage: "<b>Erreur de Clemz</b><br>Réessaye ou contacte moi à clement@clemz.app",
                                    showUiMessage: !0,
                                    devMessage: "SFS-global - code",
                                    backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                    showProgressUiError: !0,
                                });
                            }
                    },
                };
            },
            { "./apiCalls.js": 1, "./utilities.js": 12 },
        ],
        11: [
            function (e, t, o) {
                const { t: s, Se: r, K: a, Le: n, G: i, Y: c, ee: l } = e("./utilities.js"),
                    { C: u, u: d, m: m, R: g, T: p } = e("./apiCalls.js");
                async function f() {
                    let e = (await s(["smartDressingItems"])).smartDressingItems,
                        t = document.querySelector(".feed-grid");
                    t.style.position = "relative";
                    let o = document.createElement("div");
                    o.classList.add("smart-dressing-loader"),
                        (o.innerHTML = '\n    <div class="spinner-border text-primary text-xl" role="status">\n      <span class="sr-only">Loading...</span>\n    </div>'),
                        t.insertBefore(o, t.firstChild),
                        (document.querySelector("#articleTypeCount").textContent = document.querySelector("#articleTypeForm").querySelectorAll("input:checked").length);
                    let a = document.querySelector("#searchWordForm input").value.toLowerCase().split(" ");
                    for (let t of a) e = e.filter((e) => e.description.toLowerCase().includes(t) || e.title.toLowerCase().includes(t) || e.brand.toLowerCase().includes(t));
                    let i = document.querySelector("#hashTagSelect").value,
                        c = new RegExp(`${i}(\\W|$)`, "g");
                    (e = e.filter((e) => e.description.match(c))),
                        (normalArticles = document.querySelector("#normalArticlesCheckbox").checked),
                        (reservedArticles = document.querySelector("#reservedArticlesCheckbox").checked),
                        (hiddenArticles = document.querySelector("#hiddenArticlesCheckbox").checked),
                        (soldArticles = document.querySelector("#soldArticlesCheckbox").checked),
                        (e = e.filter((e) =>
                            (function (e, t, o, s, r) {
                                let a = !e.can_be_sold || 1 == e.is_hidden || 1 == e.is_reserved || t,
                                    n = 1 != e.is_reserved || o,
                                    i = e.can_be_sold || r,
                                    c = 1 != e.is_hidden || s;
                                return !!(a & i && c && n);
                            })(e, normalArticles, reservedArticles, hiddenArticles, soldArticles)
                        )),
                        document.querySelector("#filterIdentifiedOnly").checked && (e = e.filter((e) => r(e)));
                    let l = document.querySelector("#orderBySelect").value;
                    "desc" == document.querySelector("#orderSelect").value && (l = `-${l}`),
                        e.sort(n(l, l.includes("price_amount"))),
                        (document.querySelector("#articleCount").textContent = e.length),
                        0 == e.length ? document.querySelector("#emptyResultsMessage").classList.remove("d-none") : document.querySelector("#emptyResultsMessage").classList.add("d-none"),
                        await (async function (e, t = 500) {
                            const o = await s(["mainList", "sideList", "userInfo"]);
                            let a = o.mainList,
                                n = o.sideList,
                                i = o.userInfo;
                            "admin" == i.role && console.log(e);
                            let c,
                                l = document.querySelectorAll(".feed-grid__item");
                            for (element of l)
                                if (element.querySelector("img")) {
                                    c = element;
                                    break;
                                }
                            let u = c.cloneNode(!0);
                            u.id = "";
                            let d = "ItemBox__top",
                                m = "ItemBox__image-container",
                                g = "Cell__cell",
                                p = "ItemBox__title-content",
                                f = "service-fee-included-title",
                                h = "ItemBox__subtitle",
                                b = "ItemBox__details",
                                w = "ItemBox__favourites",
                                M = u.querySelector(`[class*='${w}']`);
                            M && M.remove();
                            let v = u.querySelector(`[class*='${m}']`);
                            if (v) {
                                let e = v.querySelector(`[class*='${g}']`);
                                e && e.remove();
                            }
                            let y = u.querySelector("[class*='Button']");
                            y && y.remove();
                            (u.querySelector(`[class*='${d}']`).innerHTML = ""),
                                u.querySelector("a").classList.remove("cursor-default"),
                                (imageBoxElement = u.querySelector(`[class*='${m}']`)),
                                imageBoxElement && (imageBoxElement.classList.remove("vinz-waiting"), imageBoxElement.classList.remove("vinz-selected"));
                            let U = document.querySelectorAll(".feed-grid__item");
                            for (item of U) item.remove();
                            document.querySelector("#max-items-shown-message") && document.querySelector("#max-items-shown-message").remove();
                            for (let o = 0; o < e.length && o < t; o++) {
                                let s = e[o],
                                    c = "";
                                a && a.some((e) => e.id == s.id) && (c += "📥");
                                n && n.some((e) => e.id == s.id) && (c += "📦"), s.promoted && (c += "⏫"), (c += r(s, i.role));
                                let l = document.querySelector(".feed-grid"),
                                    m = await u.cloneNode(!0);
                                (m.dataset.itemId = s.id),
                                    s.photos[0] ? (m.querySelector("img").src = s.photos[0].thumbnails[2].url) : (m.querySelector("img").src = chrome.runtime.getURL("images/placeholder-min_4.png")),
                                    (m.querySelector("a").href = s.url),
                                    (m.querySelector("a").target = "_blank");
                                let g = "";
                                s.brand && (g = `(${s.brand})`),
                                    (m.querySelector(`[class*='${p}']`).innerHTML = `<span>${s.price_amount} ${s.price_currency_code} ${g}</span>`),
                                    m.querySelector(`[data-testid*='${f}']`) && (m.querySelector(`[data-testid*='${f}']`).textContent = `${s?.total_item_price} ${s.price_currency_code} incl.`),
                                    (m.querySelector(`[class*='${h}']`).style.height = "auto"),
                                    (m.querySelector(`[class*='${h}']`).innerHTML = `<span>taille: ${s.size}</span> <br> <span>❤️${s.favourite_count} | 👁️${s.view_count} | 💬${s.conversations} | 🖥️${s.impressions}</span>`);
                                let w = m.querySelector(`[class*='${b}']`);
                                if (
                                    ((w.style.fontWeight = "bold"),
                                    (w.style.color = "#0569c8"),
                                    (w.innerHTML = `<span>Créé : ${s.created_at}</span>`),
                                    (m.querySelector(`[class*='${d}']`).innerHTML = `<div class="text-right h3 w-100 top-right-icons"><span class="bg-light-grey">${c}</span></div>`),
                                    m
                                        .querySelector("a")
                                        .insertAdjacentHTML(
                                            "beforeend",
                                            '<div><div class="web_ui__Cell__cell web_ui__Cell__narrow web_ui__Cell__amplified" role="presentation" id="cell-background" style="background-color: transparent;"><div class="web_ui__Cell__content"><div class="web_ui__Cell__body"><h4 class="web_ui__Text__text web_ui__Text__caption web_ui__Text__left web_ui__Text__inverse" id="cell-text"></h4></div></div></div></div>'
                                        ),
                                    1 == s.is_hidden
                                        ? ((m.querySelector("#cell-background").style.backgroundColor = "#757575"), (m.querySelector("#cell-text").textContent = "Masqué"))
                                        : s.can_be_sold
                                        ? 1 == s.is_reserved && ((m.querySelector("#cell-background").style.backgroundColor = "#171717"), (m.querySelector("#cell-text").textContent = "Réservé"))
                                        : ((m.querySelector("#cell-background").style.backgroundColor = "#197B56"), (m.querySelector("#cell-text").textContent = "Vendu")),
                                    l.appendChild(m),
                                    o == t - 1)
                                ) {
                                    let e = document.createElement("div");
                                    (e.id = "max-items-shown-message"),
                                        (e.classList = "w-100 border-lg border-danger rounded mx-2 text-center"),
                                        (e.innerHTML =
                                            "<p class='h4 font-weight-bold'>⚠️affichage limité à 500 articles en même temps⚠️<br></p> Pour afficher les annonces <u class='font-weight-bolder'>du fond</u> de ton dressing, soit :<br>1) Applique un filtre pour afficher moins de 500 annonces<br>2) ou change le sens de tri pour afficher le fond en haut"),
                                        l.appendChild(e);
                                }
                            }
                            for (let e = 0; e < 30; e++) {
                                let e = document.querySelector(".feed-grid"),
                                    t = await u.cloneNode(!0);
                                (t.querySelector("img").src = chrome.runtime.getURL("images/white.png")),
                                    t.querySelector("a") && (t.querySelector("a").removeAttribute("href"), t.querySelector("a").classList.add("cursor-default")),
                                    (t.querySelector(`[class*='${p}']`).innerHTML = ""),
                                    (t.querySelector(`[class*='${h}']`).innerHTML = ""),
                                    (t.querySelector(`[class*='${b}']`).innerHTML = ""),
                                    t.querySelector(`[data-testid*='${f}']`) && (t.querySelector(`[data-testid*='${f}']`).parentNode.innerHTML = ""),
                                    e.appendChild(t);
                            }
                            document.querySelector("#smartDressingSpacer")
                                ? document.querySelector("#smartDressingSpacer").scrollIntoView({ block: "start", behavior: "smooth" })
                                : document.querySelector("#legendButton") && document.querySelector("#legendButton").scrollIntoView({ block: "center", behavior: "smooth" });
                        })(e),
                        document.querySelector(".smart-dressing-loader").remove();
                }
                function h() {
                    fetch(chrome.runtime.getURL("html/globalModals/smartDressingLegend.html"))
                        .then((e) => e.text())
                        .then((e) => {
                            i(e, !1, !1);
                        });
                }
                t.exports = {
                    ue: async function (e, t) {
                        if ((chrome.storage.local.remove(["globalUiMessage"]), "success" != (await u()))) return;
                        const o = await s(["userInfo", "activeAlertsArray"]),
                            r = o.activeAlertsArray,
                            n = o.userInfo,
                            i = n.profileUrl,
                            b = n.role;
                        if (!i) return void chrome.storage.local.set({ globalUiMessage: { content: "<b>Fonctionnalité inactivée</b><br>Republie un article de ton dressing pour l'activer", type: "danger" } });
                        if ("disconnected" == a(n)) {
                            const e = window.location.hostname;
                            return void chrome.storage.local.set({ globalUiMessage: { content: `<p>Connecte-toi à ton compte Vinted : <a href="https://${e}/member/general/login">clique ici</a></p>`, type: "warning" } });
                        }
                        let w = window.location.href;
                        if ("admin" == b || w.includes(i))
                            if (null == document.querySelector(".vinz-selected"))
                                if (null != document.querySelector("[class*='feed-grid']")) {
                                    if ("continue" == (await l("smartDressing", r)))
                                        try {
                                            !(async function (e, t, o) {
                                                await c(),
                                                    chrome.storage.local.set({
                                                        progressUiMessage: {
                                                            currentIndex: 0,
                                                            totalIndex: 2,
                                                            stage: "Clemz récupère tes articles...",
                                                            articleName: "Smart dressing",
                                                            articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                                            showLoader: !0,
                                                        },
                                                    }),
                                                    await d(),
                                                    e || (e = "");
                                                t || (t = "");
                                                let s = `${e} -> ${t}`,
                                                    r = await g(1, "smartDressing", s);
                                                if ("success" != r.message) return;
                                                let a = r.activityUid,
                                                    n = window.location.href.split("/"),
                                                    i = n[n.length - 1].split("-")[0];
                                                const l = new RegExp("^[0-9]*$");
                                                if (!i || !l.test(i))
                                                    return void chrome.storage.local.set({
                                                        progressUiMessage: {
                                                            currentIndex: 0,
                                                            totalIndex: 2,
                                                            stage: "Cette action doit être lancée sur un dressing",
                                                            articleName: "XX Erreur XX",
                                                            articleImageUrl: chrome.runtime.getURL("images/bot_sad.png"),
                                                            showLoader: !1,
                                                            processFinishedButton: "close",
                                                        },
                                                    });
                                                let u = await (async function (e, t, o) {
                                                    let s,
                                                        r = 1,
                                                        a = 0,
                                                        n = [],
                                                        i = [],
                                                        c = [],
                                                        l = t,
                                                        u = !0;
                                                    for (; u; ) {
                                                        a += 1;
                                                        try {
                                                            s = await m(e, (per_page = 100), a, o, (functionCallNumber = 0));
                                                        } catch (e) {
                                                            return void chrome.runtime.sendMessage({
                                                                message: "error",
                                                                origin: "code",
                                                                uiMessage: "<b>Erreur de connexion avec Vinted</b> en récupérant vos articles",
                                                                showUiMessage: !0,
                                                                devMessage: "SDS-FIUIE - code",
                                                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                                showProgressUiError: !0,
                                                            });
                                                        }
                                                        if (null != s.errorMessage) return;
                                                        let t;
                                                        1 == r && (r = s.pagination.total_pages),
                                                            l ? ((t = Math.min(s.pagination.total_entries, l)), l > s.pagination.total_entries && (l = s.pagination.total_entries)) : ((t = s.pagination.total_entries), (l = t));
                                                        for (let e of s.items) {
                                                            let t = {};
                                                            (t.view_count = e.view_count),
                                                                (t.favourite_count = e.favourite_count),
                                                                (t.brand = e.brand),
                                                                (t.created_at_ts = e.created_at_ts),
                                                                (t.promoted = e.promoted),
                                                                (t.user_updated_at_ts = e.user_updated_at_ts),
                                                                (t.photos = [e.photos[0]]),
                                                                (t.created_at = e.created_at),
                                                                (t.id = e.id),
                                                                (t.url = e.url),
                                                                (t.price_amount = e.price.amount),
                                                                (t.price_currency_code = e.price.currency_code),
                                                                (t.total_item_price = e.total_item_price),
                                                                (t.size = e.size),
                                                                (t.is_hidden = e.is_hidden),
                                                                (t.can_be_sold = e.can_be_sold),
                                                                (t.is_reserved = e.is_reserved),
                                                                (t.description = e.description),
                                                                (t.title = e.title),
                                                                e.performance ? ((t.conversations = e.performance.conversations || 0), (t.impressions = e.performance.impressions || 0)) : ((t.conversations = 0), (t.impressions = 0));
                                                            let o = e.description.match(/#[a-zA-ZÀ-ÿ0-9_]+/g);
                                                            o && (i = i.concat(o));
                                                            let s = e.brand_dto;
                                                            s && (c = c.concat(s)), n.push(t);
                                                        }
                                                        (a >= r || n.length >= l) && (u = !1),
                                                            chrome.storage.local.set({
                                                                progressUiMessage: {
                                                                    currentIndex: n.length,
                                                                    totalIndex: t,
                                                                    stage: "Clemz récupère tes articles..",
                                                                    articleName: "Smart dressing",
                                                                    articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                                                    showLoader: !0,
                                                                },
                                                            });
                                                    }
                                                    return { fetchedItems: n, itemsEnd: l, hashTags: i, brandData: c };
                                                })(i, t, a);
                                                const b = [...new Map(u.brandData.map((e) => [e.id, e])).values()];
                                                let w = u.fetchedItems;
                                                (t = u.itemsEnd), e && e > t && (e = 1);
                                                e && (w = w.slice(e - 1, t));
                                                let M = u.hashTags;
                                                M = [...new Set(M)].sort();
                                                try {
                                                    await chrome.storage.local.set({ smartDressingItems: w });
                                                } catch (e) {
                                                    return void chrome.runtime.sendMessage({
                                                        message: "error",
                                                        origin: "code",
                                                        uiMessage: '<b>Erreur de mémoire : trop d\'articles à afficher</b><br>Mémoire saturée : utilisez le bouton "smart dressing partiel".',
                                                        showUiMessage: !0,
                                                        devMessage: "MDS - storage",
                                                        backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                        showProgressUiError: !0,
                                                    });
                                                }
                                                chrome.storage.local.set({
                                                    progressUiMessage: {
                                                        currentIndex: 1,
                                                        totalIndex: 2,
                                                        stage: "Clemz affiche tes articles",
                                                        articleName: "Smart dressing",
                                                        articleImageUrl: chrome.runtime.getURL("images/bot_search.png"),
                                                        showLoader: !0,
                                                    },
                                                }),
                                                    await fetch(chrome.runtime.getURL("html/partials/smartDressingHeader.html"))
                                                        .then((e) => e.text())
                                                        .then((o) => {
                                                            document.querySelector("[data-testid='pushup-banner']")?.remove(),
                                                                document.querySelector("[data-testid='cp-banner']")?.remove(),
                                                                document.querySelector(".profile [class*='Spacer_x2-']")?.remove(),
                                                                document.querySelector(".featured-collection-container")?.remove();
                                                            let s = document.querySelector("[class*='feed-grid']").parentElement.parentElement,
                                                                r = s.children;
                                                            for (let e = r.length - 1; e >= 0; e--) r[e].querySelector("[class*='feed-grid']") || r[e].remove();
                                                            document.querySelector("#smartDressingHeader")?.remove(),
                                                                document.querySelector("#smartDressingSpacer")?.remove(),
                                                                s.insertAdjacentHTML("afterbegin", o),
                                                                e &&
                                                                    ((document.querySelector("#partialSmartDressing").style.display = "inline"),
                                                                    (document.querySelector("#itemsBeginNumber").textContent = e),
                                                                    (document.querySelector("#itemsEndNumber").textContent = t)),
                                                                window.scrollTo(0, 0);
                                                            let a = document.querySelector("#smartDressingHeader"),
                                                                n = document.querySelector("#smartDressingSpacer"),
                                                                i = a.getBoundingClientRect().top;
                                                            window.scrollTo(0, i),
                                                                (window.onscroll = function () {
                                                                    a.getBoundingClientRect();
                                                                    window.scrollY > i
                                                                        ? ((a.style.position = "fixed"), (a.style.top = 0), (a.style.left = 0), (n.style.height = `${a.offsetHeight}px`))
                                                                        : ((a.style.position = "relative"), (n.style.height = 0));
                                                                }),
                                                                (document.querySelector("#question-mark-icon").src = chrome.runtime.getURL("images/question-circle-solid.svg")),
                                                                document.querySelector("#searchWordForm").addEventListener("submit", function (e) {
                                                                    e.preventDefault(), f();
                                                                }),
                                                                document.querySelector("#hashTagSelect").addEventListener("change", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#orderBySelect").addEventListener("change", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#orderSelect").addEventListener("change", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#toggleFiltersButton").addEventListener("click", function (e) {
                                                                    this.querySelector("#addFiltersButton").classList.toggle("d-none"),
                                                                        this.querySelector("#removeFiltersButton").classList.toggle("d-none"),
                                                                        document.querySelector("#additionnalFilters").classList.toggle("d-none");
                                                                }),
                                                                document.querySelector("#normalArticlesCheckbox").addEventListener("click", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#reservedArticlesCheckbox").addEventListener("click", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#hiddenArticlesCheckbox").addEventListener("click", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#soldArticlesCheckbox").addEventListener("click", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#filterIdentifiedOnly").addEventListener("change", function () {
                                                                    f();
                                                                }),
                                                                document.querySelector("#legendButton").addEventListener("click", function (e) {
                                                                    h();
                                                                }),
                                                                document.querySelector("#question-mark-icon").addEventListener("click", function (e) {
                                                                    h();
                                                                }),
                                                                document.querySelector("#resetFilters").addEventListener("click", function (e) {
                                                                    (document.querySelector("#searchWordForm input").value = ""),
                                                                        (document.querySelector("#hashTagSelect").selectedIndex = 0),
                                                                        (document.querySelector("#orderBySelect").selectedIndex = 0),
                                                                        (document.querySelector("#orderSelect").selectedIndex = 0),
                                                                        (document.querySelector("#normalArticlesCheckbox").checked = !0),
                                                                        (document.querySelector("#reservedArticlesCheckbox").checked = !0),
                                                                        (document.querySelector("#hiddenArticlesCheckbox").checked = !0),
                                                                        (document.querySelector("#soldArticlesCheckbox").checked = !0),
                                                                        f();
                                                                });
                                                            let c = document.querySelector("#hashTagSelect");
                                                            for (let e of M) {
                                                                let t = document.createElement("option");
                                                                (t.value = e), (t.text = e), c.add(t, null);
                                                            }
                                                            if (null == M[0]) {
                                                                let e = document.createElement("option");
                                                                (e.value = ""), (e.text = "(aucun # trouvé)"), c.add(e, null);
                                                            }
                                                        }),
                                                    await f(),
                                                    await p("smartDressing", a, JSON.stringify(b), null),
                                                    setTimeout(function () {
                                                        chrome.storage.local.set({ activityUid: "" });
                                                    }, 2e3),
                                                    chrome.storage.local.set({
                                                        progressUiMessage: {
                                                            currentIndex: 2,
                                                            totalIndex: 2,
                                                            stage: "Ton dressing est prêt !",
                                                            articleName: "Smart dressing",
                                                            articleImageUrl: chrome.runtime.getURL("images/bot_celebration.png"),
                                                            showLoader: !1,
                                                            processFinishedButton: "minimize",
                                                        },
                                                    });
                                            })(e, t);
                                        } catch (e) {
                                            return void chrome.runtime.sendMessage({
                                                message: "error",
                                                origin: "code",
                                                uiMessage: "<b>Erreur de Clemz</b><br>Réessaye ou contacte moi à clement@clemz.app",
                                                showUiMessage: !0,
                                                devMessage: "SDS-global - code",
                                                backtrace: JSON.stringify(e, ["message", "arguments", "type", "name"]),
                                                showProgressUiError: !1,
                                            });
                                        }
                                } else chrome.storage.local.set({ globalUiMessage: { content: 'Tu dois être dans l\'onglet "Dressing" de ton compte (pas "Evaluations" ni "A propos").', type: "danger" } });
                            else chrome.storage.local.set({ globalUiMessage: { content: "Sélection en cours : rafraîchissez la page d'abord ou videz la sélection.", type: "warning", time: 3e3 } });
                        else
                            chrome.storage.local.set({
                                globalUiMessage: { content: `Cette action doit être effectuée sur ta page de dressing Vinted ${i} (<a href="${window.location.origin}/member/${i}" class="text-white">=>clique ici<=</a>)`, type: "warning" },
                            });
                    },
                };
            },
            { "./apiCalls.js": 1, "./utilities.js": 12 },
        ],
        12: [
            function (e, t, o) {
                async function s(e) {
                    return new Promise(function (t, o) {
                        chrome.storage.local.get(e, function (e) {
                            t(e);
                        });
                    });
                }
                function r() {
                    let e = document.querySelectorAll(".can-be-disabled");
                    for (let t of e) (t.disabled = !1), (t.querySelector(".spinner-border").style.display = "none");
                }
                async function a() {
                    for (let e of document.querySelectorAll(".click-to-copy"))
                        e.addEventListener("click", function () {
                            navigator.clipboard.writeText(this.textContent), chrome.storage.local.set({ globalUiMessage: { content: `Le texte "${this.textContent}" a été copié dans ton presse-papier.`, type: "info", time: 4e3 } });
                        });
                }
                async function n() {
                    let e = document.querySelectorAll("img.vinz-image");
                    for (let t of e) {
                        let e = t.dataset.imageName;
                        t.src = chrome.runtime.getURL(`images/${e}`);
                    }
                }
                async function i(e, t, o) {
                    return (
                        (existingGlobalModal = document.querySelector(".global-modal")),
                        existingGlobalModal && existingGlobalModal.remove(),
                        (globalModal = document.createElement("div")),
                        (globalModal.className = "global-modal"),
                        document.body.appendChild(globalModal),
                        (modalContent = document.createElement("div")),
                        globalModal.appendChild(modalContent),
                        (modalContent.className = "global-modal-content"),
                        0 == o &&
                            ((modalClose = document.createElement("span")),
                            modalContent.appendChild(modalClose),
                            (modalClose.className = "global-modal-close"),
                            (modalClose.innerHTML = "&times;"),
                            (modalClose.onclick = function () {
                                r(), globalModal.remove();
                            })),
                        (modalBodyDiv = document.createElement("div")),
                        (modalBodyDiv.innerHTML = e),
                        await modalContent.appendChild(modalBodyDiv),
                        n(),
                        a(),
                        0 == t &&
                            (window.onclick = function (e) {
                                e.target == globalModal && (r(), globalModal.remove());
                            }),
                        e
                    );
                }
                t.exports = {
                    t: s,
                    i: async function (e) {
                        return new Promise((t, o) => {
                            setTimeout(function () {
                                t("done");
                            }, e);
                        });
                    },
                    o: async function () {
                        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (e) => (e ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (e / 4)))).toString(16));
                    },
                    Oe: function (e, t) {
                        var o = e.indexOf(t);
                        return o > -1 && e.splice(o, 1), e;
                    },
                    K: function (e) {
                        return null == document.querySelector("#user-menu-button")
                            ? "disconnected"
                            : e
                            ? e?.username.includes(document.querySelector("#user-menu-button img").alt.split(/[^a-zA-Z0-9]+/)[0])
                                ? "ok"
                                : "wrong profile"
                            : window.location.href.includes(document.querySelector("#user-menu-button img").alt.split(/[^a-zA-Z0-9]+/)[0])
                            ? "ok"
                            : "wrong profile";
                    },
                    Se: function (e, t) {
                        return Date.parse(e.created_at_ts) - Date.parse(e.user_updated_at_ts) > 216e5 ? "📛" : "";
                    },
                    ie: function (e, t) {
                        let o = document.querySelector(`#${e}`).getElementsByClassName("tabContent");
                        for (element of o) element.style.display = "none";
                        let s = document.querySelector(`#${e}`).getElementsByClassName("tabLinks");
                        for (element of s) element.classList.remove("active");
                        document.getElementById(t).classList.add("active"), (document.querySelector(`[aria-labelledby='${t}']`).style.display = "block");
                    },
                    Le: function (e, t) {
                        let o = 1;
                        return (
                            "-" === e[0] && ((o = -1), (e = e.substr(1))),
                            function (s, r) {
                                let a;
                                return (a = t ? (parseFloat(s[e]) < parseFloat(r[e]) ? -1 : parseFloat(s[e]) > parseFloat(r[e]) ? 1 : 0) : s[e] < r[e] ? -1 : s[e] > r[e] ? 1 : 0), a * o;
                            }
                        );
                    },
                    te: r,
                    G: i,
                    W: async function (e, t, o) {
                        o || document.querySelector(".toolModal")?.remove(),
                            (toolModal = document.createElement("div")),
                            (toolModal.className = "toolModal"),
                            (toolModal.id = t),
                            (toolModal.innerHTML = e),
                            await document.querySelector("#toolBody").appendChild(toolModal),
                            n(),
                            a(),
                            toolModal.querySelector(".close-modal")?.addEventListener("click", function () {
                                r(), document.querySelector(`#${t}`).remove();
                            });
                    },
                    Y: async function () {
                        await chrome.storage.local.remove(["smartDressingItems", "autoMessageProcessedNotif", "autoMessageSent24hCount", "autoMessageLastContactWithUser"]);
                    },
                    ee: async function (e, t) {
                        let o = await s(["readActivityAlertUidsArray", "activityAlertShownCounters"]),
                            a = o.readActivityAlertUidsArray,
                            n = o.activityAlertShownCounters,
                            c = t.filter((t) => "activity_specific" == t.alert_type && t.process_types.includes(e));
                        if (((a && a.constructor == Array) || (a = []), (n && n.constructor == Object) || (n = {}), c[0] && 0 == a.filter((e) => e == c[0].uid).length)) {
                            if (
                                ((userChoiceOnAlert = await (async function (e, t, o) {
                                    let s;
                                    function r() {
                                        waitForPressResolve && waitForPressResolve(), (s = "continue");
                                    }
                                    function a() {
                                        waitForPressResolve && waitForPressResolve(), (s = "close");
                                    }
                                    return (
                                        await fetch(chrome.runtime.getURL("html/globalModals/activitySpecificAlert.html"))
                                            .then((e) => e.text())
                                            .then((t) => {
                                                i(t, (ignoreOutsideClick = !0), (removeTopRightCloseButton = !0)),
                                                    (document.querySelector("#alert-content").innerHTML = e.message),
                                                    (0 == e.can_be_muted || (e.repetition_count_before_mutable > 0 && o[e.uid] && e.repetition_count_before_mutable > o[e.uid])) &&
                                                        (document.querySelector("#alert-can-be-muted").style.display = "none"),
                                                    1 == e.blocking && ((document.querySelector("#continueAlertButton").style.display = "none"), document.querySelector("#alertButtonsDiv").classList.add("flex-row-reverse"));
                                            }),
                                        document.querySelector("#continueAlertButton").addEventListener("click", function () {
                                            r(), document.querySelector("#stopShowingAlert").checked && (t.push(e.uid), chrome.storage.local.set({ readActivityAlertUidsArray: t }));
                                        }),
                                        document.querySelector("#closeAlertButton").addEventListener("click", a),
                                        await new Promise((e) => (waitForPressResolve = e)),
                                        document.querySelector("#continueAlertButton").removeEventListener("click", r),
                                        document.querySelector("#closeAlertButton").removeEventListener("click", a),
                                        document.querySelector(".global-modal").remove(),
                                        s
                                    );
                                })(c[0], a, n)),
                                "continue" != userChoiceOnAlert)
                            )
                                return r(), "cancel";
                            n[c[0].uid] = n[c[0].uid] + 1 || 1;
                        }
                        let l = [];
                        for (let e of a) t.filter((t) => t.uid == e).length > 0 && l.push(e);
                        for (let e of Object.keys(n)) 0 == t.filter((t) => t.uid == e).length && delete n[e];
                        return chrome.storage.local.set({ readActivityAlertUidsArray: l, activityAlertShownCounters: n }), "continue";
                    },
                    oe: a,
                    ce: n,
                    le: function (e) {
                        return e.type.includes("mouse") ? (eventCoords = e) : (eventCoords = e.touches[0] || e.changedTouches[0]), eventCoords;
                    },
                    l: function () {
                        let e = document.querySelector('meta[name="csrf-token"]')?.content;
                        return e || (e = "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e"), e;
                    },
                };
            },
            {},
        ],
    },
    {},
    [4]
);
