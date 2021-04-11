import re

number_set = set()

usps = '([A-Z]{2}\d{9}[A-Z]{2}|(420\d{9}(9[2345])?)?\d{20}|(420\d{5})?(9[12345])?(\d{24}|\d{20})|82\d{8})'
ups = '(1Z[A-H,J-N,P,R-Z,0-9]{16})'
fedex = '\D([0-9]{12}|100\d{31}|\d{15}|\d{18}|96\d{20}|96\d{32})\D'

pattern = re.compile(f'{usps}|{ups}|{fedex}')
fedex_pattern = re.compile(fedex)

for line in open("./test_emails/mercari.txt"):
    for match in re.finditer(pattern, line):
        if fedex_pattern.match(match[0]):
            number = re.sub("[^0-9]", "", match[0])
            number_set.add(number)
        else:
            number_set.add(match[0])

print(number_set)
