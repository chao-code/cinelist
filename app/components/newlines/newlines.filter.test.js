describe('Newlines Filter', function() {

  let filter;

  beforeEach(module('newlines.filters'));

  beforeEach(inject(function(newlinesFilter) {
    filter = newlinesFilter;
  }));

  it('should convert each \n to <br>', function() {
    let text;
    expect(filter(text)).toBeUndefined();

    text = 'first line\nsecond line\n\nfourth line';
    expect(filter(text)).toEqual('first line<br>second line<br><br>fourth line');
  });
});