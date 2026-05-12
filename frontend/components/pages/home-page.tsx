import { AboutUsSection } from "../sections/about-us";
import { Button } from "../ui/button";

export function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-white text-zinc-950">
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://homebuilding.ru/wp-content/uploads/2017/05/roskoshnye-vanny-shikarnye-2.jpg)",
          }}
          role="img"
          aria-label="Премиальная сантехника и ванная комната"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-20 max-w-5xl px-4 sm:px-6 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white mb-4 md:mb-6">
            Leppa & WenSton
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base sm:text-lg md:text-xl font-light text-white">
            Премиальная сантехника и архитектура ванной комнаты: выразительные
            материалы, точная геометрия и эстетика спокойной роскоши.
          </p>
          <div className="flex justify-center">
            <Button type="button" variant="secondary">
              Смотреть каталог
            </Button>
          </div>
        </div>
      </section>
      <AboutUsSection />
    </div>
  );
}
