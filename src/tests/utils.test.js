const { replaceLink } = require("../utils.js");

test('a message without a link should not work', () => {
    const value = replaceLink('fjdkasfjldsajf');
    expect(value).toBeUndefined();
})

describe('Tiktok links', () => {
    test('Links with "t" id should parse correctly', () => {
        const value = replaceLink('https://www.tiktok.com/t/ZTFcqUXqp/');
        expect(value).toBe('https://www.vxtiktok.com/t/ZTFcqUXqp/');
    });

    test('Links that have something more than just a link should not be processed', () => {
        const value = replaceLink('https://www.tiktok.com/t/ZTFcqUXqp/  ');
        expect(value).toBeUndefined();
    })

    describe('links with "user" id', () => {

        test('links just with "user" id with the /', () => {
            const value = replaceLink('https://www.tiktok.com/@orangemoon27/video/7427677592553131307/');
            expect(value).toBe('https://www.vxtiktok.com/@orangemoon27/video/7427677592553131307/');
        })

        test('links just with "user" id with out the /', () => {
            const value = replaceLink('https://www.tiktok.com/@orangemoon27/video/7427677592553131307');
            expect(value).toBe('https://www.vxtiktok.com/@orangemoon27/video/7427677592553131307/');
        })

        test('links with "user" id and "is_from_webap" query', () => {
            const value = replaceLink('https://www.tiktok.com/@orangemoon27/video/7427677592553131307?is_from_webapp=1&sender_device=pc');
            console.log(value)
            expect(value).toBe('https://www.vxtiktok.com/@orangemoon27/video/7427677592553131307/');
        })
    })
})

describe('Twitter links', () => {

    test('Links that have something more than just a link should not be processed', () => {
        const value = replaceLink('https://x.com/nocontextfrogs/status/1854245804636307732  ');
        expect(value).toBeUndefined();
    })

    describe('Links with "status" id should parse correctly', () => {
        test('Without the /', () => {
            const value = replaceLink('https://x.com/nocontextfrogs/status/1854245804636307732');
            expect(value).toBe('https://fixupx.com/nocontextfrogs/status/1854245804636307732');
        })

        test('With the /', () => {
            const value = replaceLink('https://x.com/nocontextfrogs/status/1854245804636307732/');
            expect(value).toBe('https://fixupx.com/nocontextfrogs/status/1854245804636307732');
        });

        test('With the "t" query', () => {
            let objs = [{input: 'https://x.com/nocontextfrogs/status/1854245804636307732?t=DPyJiFEk9KbcF6zHaCHWHA&s=19', expect: "https://fixupx.com/nocontextfrogs/status/1854245804636307732"}]
            let value = replaceLink('https://x.com/nocontextfrogs/status/1854245804636307732?t=DPyJiFEk9KbcF6zHaCHWHA&s=19');
            expect(value).toBe('https://fixupx.com/nocontextfrogs/status/1854245804636307732');

            value = replaceLink('https://x.com/crocoduck_king/status/1853959783088587091?t=32DMKGJOKiqh7uJtRIZhww&s=19');
            expect(value).toBe('https://fixupx.com/crocoduck_king/status/1853959783088587091');

        })
    })
})



describe('Instagram links', () => {
    describe('Pictures', () => {
        test('Links that have something more than just a link should not be processed', () => {
            const value = replaceLink('https://www.instagram.com/p/DB0_SOhvOGM/  ');
            expect(value).toBeUndefined();
        })

        test('link should work with /', () => {
            const value = replaceLink('https://www.instagram.com/p/DB0_SOhvOGM/');
            expect(value).toBe('https://www.ddinstagram.com/p/DB0_SOhvOGM/');
        })

        test('link should work without /', () => {
            const value = replaceLink('https://www.instagram.com/p/DB0_SOhvOGM');
            expect(value).toBe('https://www.ddinstagram.com/p/DB0_SOhvOGM/');
        })

        describe('if link has an index query, keep it', () => {
            test('index 1', () => {
                const value = replaceLink('https://www.instagram.com/p/DB0_SOhvOGM/?img_index=1');
                expect(value).toBe('https://www.ddinstagram.com/p/DB0_SOhvOGM/?img_index=1');
            })

            test('index 2', () => {
                const value = replaceLink('https://www.instagram.com/p/DB0_SOhvOGM/?img_index=2');
                expect(value).toBe('https://www.ddinstagram.com/p/DB0_SOhvOGM/?img_index=2');
            })
        })
    })

    describe('Reels', () => {
        test('Links that have something more than just a link should not be processed', () => {
            const value = replaceLink('https://www.instagram.com/reel/DBFlxZiSbVz/  ');
            expect(value).toBeUndefined();
        })

        test('reels should work', () => {
            const value = replaceLink('https://www.instagram.com/reel/DBFlxZiSbVz/');
            expect(value).toBe('https://www.ddinstagram.com/reel/DBFlxZiSbVz/');
        })
    })
})