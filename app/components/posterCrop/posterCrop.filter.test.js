describe('PosterCrop Filter', function() {

  let filter;

  beforeEach(module('posterCrop.filters'));

  beforeEach(inject(function(posterCropFilter) {
    filter = posterCropFilter;
  }));

  it('should add size crop to poster links', function() {
    let poster;
    expect(filter(poster)).toEqual('');

    poster = 'img@._V1_SX300.jpg';
    expect(filter(poster)).toEqual('img@._V1_SX300_CR0,0,300,444_AL_.jpg');
  });
});