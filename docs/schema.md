# Schema

A Fase 0 não define schema de medicamento porque nenhuma fonte foi validada. O schema da Fase 1 será derivado dos campos realmente presentes e versionado. Campos ausentes nunca serão inventados; `null` será apresentado como “não informado pela fonte”. Preços serão armazenados em centavos inteiros ou `Decimal`, com tipo, tributo, vigência e fonte.
