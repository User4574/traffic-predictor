require 'nokogiri'
require 'json'

FN = ARGV.shift.chomp

doc = File.open("#{FN}.xml") { |f| Nokogiri::XML(f) }

tstart = doc.css("xport>meta>start").text.to_i
tstep = doc.css("xport>meta>step").text.to_i

rcvd = []
rmax = 0
sent = []
smax = 0

doc.css("xport>data>row").each do |row|
  t = (row.css("t").text.to_i - tstart) / tstep
  r = row.css("v")[0].text.to_f
  s = row.css("v")[1].text.to_f

  rmax = r if r > rmax
  smax = s if s > smax

  rcvd << { t: t, v: r }
  sent << { t: t, v: s }
end

rmax *= 1.10
smax *= 1.10

rcvd.each do |r|
  r[:v] /= rmax
end

sent.each do |s|
  s[:v] /= smax
end

File.open("#{FN}.rcvd.json", "w") do |f|
  f.puts({
    max: rmax,
    data: rcvd
  }.to_json)
end

File.open("#{FN}.sent.json", "w") do |f|
  f.puts({
    max: smax,
    data: sent
  }.to_json)
end
