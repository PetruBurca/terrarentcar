import { useMemo, useCallback } from "react";

// Хук для мемоизации фильтрации машин
export function useFilteredCars(cars: any[], searchDates: any, filters: any) {
  return useMemo(() => {
    if (!cars || cars.length === 0) return [];

    return cars.filter((car) => {
      // Фильтр по датам
      if (searchDates?.from && searchDates?.to) {
        // Проверяем доступность машины в выбранные даты
        const isAvailable = true; // Здесь можно добавить логику проверки
        if (!isAvailable) return false;
      }

      // Фильтр по цене
      if (filters?.maxPrice && car.price > filters.maxPrice) {
        return false;
      }

      // Фильтр по пассажирам
      if (filters?.passengers && car.passengers < filters.passengers) {
        return false;
      }

      // Фильтр по типу топлива
      if (filters?.fuel && car.fuel !== filters.fuel) {
        return false;
      }

      // Фильтр по трансмиссии
      if (filters?.transmission && car.transmission !== filters.transmission) {
        return false;
      }

      return true;
    });
  }, [cars, searchDates, filters]);
}

// Хук для мемоизации сортировки
export function useSortedCars(
  cars: any[],
  sortBy: string,
  sortOrder: "asc" | "desc" = "asc"
) {
  return useMemo(() => {
    if (!cars || cars.length === 0) return [];

    return [...cars].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Специальная обработка для цен
      if (sortBy === "price") {
        aValue = a.pricePerDay || a.price;
        bValue = b.pricePerDay || b.price;
      }

      // Специальная обработка для рейтинга
      if (sortBy === "rating") {
        aValue = a.rating || 0;
        bValue = b.rating || 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [cars, sortBy, sortOrder]);
}

// Хук для мемоизации пагинации
export function usePaginatedCars(cars: any[], page: number, pageSize: number) {
  return useMemo(() => {
    if (!cars || cars.length === 0) return { cars: [], totalPages: 0 };

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCars = cars.slice(startIndex, endIndex);
    const totalPages = Math.ceil(cars.length / pageSize);

    return {
      cars: paginatedCars,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }, [cars, page, pageSize]);
}

// Хук для мемоизации статистики
export function useCarsStats(cars: any[]) {
  return useMemo(() => {
    if (!cars || cars.length === 0) {
      return {
        total: 0,
        averagePrice: 0,
        averageRating: 0,
        priceRange: { min: 0, max: 0 },
        fuelTypes: {},
        transmissionTypes: {},
      };
    }

    const prices = cars
      .map((car) => car.pricePerDay || car.price)
      .filter(Boolean);
    const ratings = cars.map((car) => car.rating).filter(Boolean);

    const fuelTypes = cars.reduce((acc, car) => {
      acc[car.fuel] = (acc[car.fuel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const transmissionTypes = cars.reduce((acc, car) => {
      acc[car.transmission] = (acc[car.transmission] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: cars.length,
      averagePrice:
        prices.length > 0
          ? prices.reduce((a, b) => a + b, 0) / prices.length
          : 0,
      averageRating:
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
      fuelTypes,
      transmissionTypes,
    };
  }, [cars]);
}

// Хук для мемоизации поиска
export function useSearchCars(cars: any[], searchTerm: string) {
  return useMemo(() => {
    if (!cars || cars.length === 0 || !searchTerm) return cars;

    const term = searchTerm.toLowerCase();

    return cars.filter((car) => {
      return (
        car.name?.toLowerCase().includes(term) ||
        car.description?.toLowerCase().includes(term) ||
        car.description_ru?.toLowerCase().includes(term) ||
        car.description_ro?.toLowerCase().includes(term) ||
        car.description_en?.toLowerCase().includes(term) ||
        car.category?.toLowerCase().includes(term) ||
        car.fuel?.toLowerCase().includes(term) ||
        car.transmission?.toLowerCase().includes(term) ||
        car.year?.toString().includes(term)
      );
    });
  }, [cars, searchTerm]);
}
