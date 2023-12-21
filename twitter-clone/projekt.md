# Serwis-Y

W oparciu o (i z wykorzystaniem) `Node.js` i biblioteki `Socket.io` oraz `Vue.js` stwórz serwis społecznościowy pozwalający na następujące operacje:

- Wersja na ocenę __<= 3.5__
  - rejestracja w serwisie i logowanie do serwera (minimum to wykorzystanie `passport-local`)
  - tworzenie/definiowanie wizytówki użytkownika konta zawierającej, niędzy innymi, „awatar” (wizytówka określa co inni użytkownicy widzą na nasz temat)
  - obserwowanie innych użytkowników
  - inicjowanie oraz uczestnictwo w „wątkach” (zamieszczamy w nich wyłącznie wpisy tekstowe)
  - odpowiadanie na wpisy („odpowiedź” generuje potencjalne „rozgałęzienie wątku”)
  - podgląd wpisów danego użytkownika (w ramach interfejsu konta)
  - cytowanie wpisów

- Wersja na ocenę __>= 4.0__
  - wszystko to co powyżej
  - responsywność interfejsu
  - podczas przeglądania wątku jesteśmy (dyskretnie) informowani o fakcie pojawienia się w nim nowych wpisów
  - możliwość umieszczania we wspisach obrazów
  - blokowanie użytkowników (z powiadomieniem o zablokowaniu)
  - metadane wpisu: liczba „odsłon” (jak wielu użytkowników przeczytało/zobaczyło dany wpis) – dynamiczna aktualizacja przy każdorazowym „otwarciu” wpisu w „widoku” (tak długo, jak wpis pozostaje widoczny, liczba odsłon nie jest aktualizowana)

## Wyjaśnienia ogólne

- Z uwagi na możliwość cytowania wpisy tworzą strukturę grafu (fizyczna reprezentacja po stronie bazy danych może oczywiście nie być grafem)
- W przypadku „blokady”, blokowany użytkownik powinien być informowany, że (konkretny) ktoś go zablokował. Blokada uniemożliwia oglądanie wpisów (ani metadanych) użytkownika, który nas zablokował.
- Obserwowanie użytkownika powoduje, że jego wpisy (pochodzące ze zdefiniowanego przez nas „okienka czasowego”), których dotychczas nie widzieliśmy pojawiają się na naszej „stronie głównej” _Serwisu-Y_.

## Uwagi techniczne

- Interfejs użytkownika budujemy za pomocą `Vue.js` (w wersji 3.*) z wykorzystaniem języka `JavaScript` i dowolnie wybranego środowiska – opartego na`Vue CLI` lub `vite`.
- Do połączeń z serwerem wykorzystujemy szyfrowanie (zarówno w części `HTTP` jak i `Websockets`)
- _Serwis-Y_ powinien przechowywać wpisy użytkowników oraz ich metadane w wybranej przez autora bazie danych.
