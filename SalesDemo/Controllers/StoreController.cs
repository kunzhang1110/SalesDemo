using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesDemo.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesDemo.Controllers
{
    [Route("api/[controller]")]
    public class StoreController : Controller
    {
        private readonly ApplicationDbContext _context;
        public StoreController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Store>>> Get()
        {
            var stores = await _context.Stores.ToListAsync();
            if (stores.Count == 0)
            {
                stores.Add(new Store());
            }
            return stores;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> Get(int id)
        {
            var store = await _context.Stores.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (store == null)
            {
                return NotFound();
            }
            return store;
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult<Store>> Post([FromBody]Store Store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _context.Stores.Add(Store);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Store), Store);

        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Store>> Put(int id, [FromBody]Store Store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var storeInDb = await _context.Stores.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (storeInDb == null)
            {
                return NotFound();
            }

            storeInDb.Name = Store.Name;
            storeInDb.Address = Store.Address;
            storeInDb.Sale = Store.Sale;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Store>> Delete(int id)
        {
            var store = await _context.Stores.Where(c => c.Id == id).SingleOrDefaultAsync();
            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
