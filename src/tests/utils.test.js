const { replaceLink } = require("../utils.js");

//todo test the parsing of links and what should / shouldn't be allowed
describe('Tiktok link parsing', () => {
    test('Links with "t" id should parse correctly', () => {
        const value = replaceLink('https://www.tiktok.com/t/ZTFcqUXqp/');
        expect(value).toBe('https://www.vxtiktok.com/t/ZTFcqUXqp/');
    });

    test('Links that have something more than just a link should not be processed', () => {
        const value = replaceLink('https://www.tiktok.com/t/ZTFcqUXqp/  ');
        expect(value).toBeUndefined();
    })

    //todo fix these
    describe('links with "user" id', () => {
        test('links just with "user" id', () => {
            const value = replaceLink('https://www.tiktok.com/@orangemoon27/video/7427677592553131307/');
            expect(value).toBe('https://www.vxtiktok.com/@orangemoon27/video/7427677592553131307/');
        })

        test('links with "user" id and "is_from_webap" query', () => {
            const value = replaceLink('https://www.tiktok.com/@orangemoon27/video/7427677592553131307?is_from_webapp=1&sender_device=pc');
            expect(value).toBe('https://www.vxtiktok.com/@orangemoon27/video/7427677592553131307/');
        })
    })
})
//todo test twitter links
//todo test instagram links
//todo test a link that is not valid (none of the links we're looking for)
//todo test a message that does not include a link
